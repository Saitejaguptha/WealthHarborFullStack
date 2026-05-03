import bcrypt from 'bcryptjs';
import { supabase } from './supabaseClient';

export interface UserInput {
  user_uuid?: string;
  username: string;
  email: string;
  number: string;
  gender?: string;
  date_of_birth?: string;
  password: string;
}

/**
 * Inserts a new user into the 'users' table in Supabase.
 */
export const insertUser = async (user: UserInput) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);
    const normalizedEmail = user.email.toLowerCase();

    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          user_uuid: user.user_uuid,
          username: user.username,
          email: normalizedEmail,
          number: user.number,
          gender: user.gender,
          date_of_birth: user.date_of_birth,
          password: hashedPassword,
        },
      ])
      .select();

    if (error) {
      console.error("❌ Error inserting user:", error.message);
      // Parse common unique constraint violations into friendly messages
      let friendlyError = error.message;
      if (error.message.includes('users_email_key') || error.message.includes('email')) {
        friendlyError = 'This email address is already registered.';
      } else if (error.message.includes('users_number_key') || error.message.includes('number')) {
        friendlyError = 'This mobile number is already registered.';
      } else if (error.message.includes('users_username_key') || error.message.includes('username')) {
        friendlyError = 'This username is already taken.';
      }
      return { success: false, error: friendlyError };
    }

    return { success: true, data: data[0] };
  } catch (err) {
    console.error("❌ Unexpected error:", err);
    return { success: false, error: err };
  }
};

/**
 * Validates a user's password for login.
 */
export const validateLogin = async (email: string, plaintextPassword: string) => {
  try {
    const normalizedEmail = email.toLowerCase();
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', normalizedEmail)
      .single();

    if (error || !user) {
        return { success: false, error: "Invalid email or password" };
    }

    const isMatch = await bcrypt.compare(plaintextPassword, user.password);

    if (!isMatch) {
      return { success: false, error: "Invalid email or password" };
    }

    const { password, ...userWithoutPassword } = user;
    return { success: true, data: userWithoutPassword };
    
  } catch (err) {
    return { success: false, error: err };
  }
};

/**
 * Updates user information using UUID.
 */
export const updateUserDetails = async (uuid: string, updates: Partial<UserInput>) => {
    try {
        // Remove password from updates if present to avoid accidental overwrite
        const { password, ...otherUpdates } = updates;

        const { data, error } = await supabase
            .from('users')
            .update(otherUpdates)
            .eq('user_uuid', uuid)
            .select();

        if (error) {
            return { success: false, error: error.message };
        }

        return { success: true, data: data[0] };
    } catch (err) {
        return { success: false, error: err };
    }
};

/**
 * Updates user password securely using UUID.
 */
export const updateUserPassword = async (uuid: string, newPassword: string) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        const { error } = await supabase
            .from('users')
            .update({ password: hashedPassword })
            .eq('user_uuid', uuid);

        if (error) {
            return { success: false, error: error.message };
        }

        return { success: true };
    } catch (err) {
        return { success: false, error: err };
    }
};

/**
 * Notifications Service
 */

export const getNotifications = async (user_uuid: string) => {
    try {
        const { data, error } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_uuid', user_uuid)
            .order('created_at', { ascending: false });

        if (error) {
            return { success: false, error: error.message };
        }

        // Map not_descrption back to description for the frontend
        const formattedData = data.map(notif => ({
            ...notif,
            not_description: notif.not_descrption || notif.not_description
        }));

        return { success: true, data: formattedData };
    } catch (err) {
        return { success: false, error: err };
    }
};

export const createNotification = async (user_uuid: string, description: string) => {
    try {
        const { data, error } = await supabase
            .from('notifications')
            // Using not_descrption to match the typo in the Supabase schema
            .insert([{ user_uuid, not_descrption: description }])
            .select();

        if (error) {
            return { success: false, error: error.message };
        }

        const formattedData = {
            ...data[0],
            not_description: data[0].not_descrption || data[0].not_description
        };

        return { success: true, data: formattedData };
    } catch (err) {
        return { success: false, error: err };
    }
};

export const deleteNotification = async (id: number) => {
    try {
        const { error } = await supabase
            .from('notifications')
            .delete()
            .eq('id', id);

        if (error) {
            return { success: false, error: error.message };
        }

        return { success: true };
    } catch (err) {
        return { success: false, error: err };
    }
};

export const deleteNotificationsByUser = async (user_uuid: string) => {
    try {
        const { error } = await supabase
            .from('notifications')
            .delete()
            .eq('user_uuid', user_uuid);

        if (error) {
            return { success: false, error: error.message };
        }

        return { success: true };
    } catch (err) {
        return { success: false, error: err };
    }
};

/**
 * Watchlist Service
 */

export const getWatchlistFromDB = async (user_uuid: string) => {
    try {
        const { data, error } = await supabase
            .from('watchlist')
            .select('*')
            .eq('user_uuid', user_uuid)
            .order('created_at', { ascending: false });

        if (error) return { success: false, error: error.message };
        return { success: true, data };
    } catch (err) {
        return { success: false, error: err };
    }
};

export const addToWatchlistDB = async (
    user_uuid: string,
    item_id: string,
    item_name: string,
    symbol: string,
    item_type: string,
    price?: number,
    change?: number,
    change_pct?: number
) => {
    try {
        const { data, error } = await supabase
            .from('watchlist')
            .insert([{ 
                user_uuid, 
                item_id, 
                item_name, 
                symbol, 
                item_type, 
                price: price || 0, 
                change: change || 0, 
                change_pct: change_pct || 0 
            }])
            .select();

        if (error) {
            // Handle unique constraint violation (code 23505) gracefully
            if (error.code === '23505' || error.message.includes('unique constraint')) {
                return { success: false, error: 'This item is already in your watchlist.' };
            }
            return { success: false, error: error.message };
        }
        return { success: true, data: data[0] };
    } catch (err) {
        return { success: false, error: err };
    }
};

export const removeFromWatchlistDB = async (user_uuid: string, item_id: string) => {
    try {
        const { error } = await supabase
            .from('watchlist')
            .delete()
            .eq('user_uuid', user_uuid)
            .eq('item_id', item_id);

        if (error) return { success: false, error: error.message };
        return { success: true };
    } catch (err) {
        return { success: false, error: err };
    }
};

export const clearWatchlistDB = async (user_uuid: string) => {
    try {
        const { error } = await supabase
            .from('watchlist')
            .delete()
            .eq('user_uuid', user_uuid);

        if (error) return { success: false, error: error.message };
        return { success: true };
    } catch (err) {
        return { success: false, error: err };
    }
};

