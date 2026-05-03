import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ScrollToTop from './components/common/ScrollToTop';

// Lazy loading all pages to prevent eager fetching of unused chunks
const Login = React.lazy(() => import('./pages/Login/Login'));
const Signup = React.lazy(() => import('./pages/Signup/Signup'));
const Home = React.lazy(() => import('./pages/Home/Home'));
const LandingHome = React.lazy(() => import('./pages/LandingHome/LandingHome'));
const Dashboard = React.lazy(() => import('./pages/Dashboard/Dashboard'));
const BeginnerGuide = React.lazy(() => import('./pages/BeginnerGuide/BeginnerGuide'));
const ErrorPage = React.lazy(() => import('./pages/ErrorPage/ErrorPage'));
const Stocks = React.lazy(() => import('./pages/Stocks/Stocks'));
const StockDetails = React.lazy(() => import('./pages/StockDetails/StockDetails'));
const MutualFunds = React.lazy(() => import('./pages/MutualFunds/MutualFunds'));
const MutualFundDetails = React.lazy(() => import('./pages/MutualFundDetails/MutualFundDetails'));
const ETFs = React.lazy(() => import('./pages/ETFs/ETFs'));
const ETFDetails = React.lazy(() => import('./pages/ETFDetails/ETFDetails'));
const GoldSilver = React.lazy(() => import('./pages/GoldSilver/GoldSilver'));
const GoldSilverDetails = React.lazy(() => import('./pages/GoldSilverDetails/GoldSilverDetails'));
const Commodities = React.lazy(() => import('./pages/Commodities/Commodities'));
const CommodityDetails = React.lazy(() => import('./pages/CommodityDetails/CommodityDetails'));
const Profile = React.lazy(() => import('./pages/Profile/Profile'));
const Watchlist = React.lazy(() => import('./pages/Watchlist/Watchlist'));
const NewsDetails = React.lazy(() => import('./pages/NewsDetails/NewsDetails'));
const MarketAnalysis = React.lazy(() => import('./pages/MarketAnalysis/MarketAnalysis'));
const Indices = React.lazy(() => import('./pages/Indices/Indices'));
const IndexDetails = React.lazy(() => import('./pages/IndexDetails/IndexDetails'));
const StocksInNews = React.lazy(() => import('./pages/StocksInNews/StocksInNews'));
const Notifications = React.lazy(() => import('./pages/Notifications/Notifications'));
const ForgotPassword = React.lazy(() => import('./pages/ForgotPassword/ForgotPassword'));
const FIIDII = React.lazy(() => import('./pages/FIIDII/FIIDII'));
const About = React.lazy(() => import('./pages/About/About'));
const FandO = React.lazy(() => import('./pages/FandO/FandO'));
const IntradayStocks = React.lazy(() => import('./pages/IntradayStocks/IntradayStocks'));
const IntradayDetails = React.lazy(() => import('./pages/IntradayDetails/IntradayDetails'));
const MarketSummary = React.lazy(() => import('./pages/MarketSummary/MarketSummary'));
const Updates = React.lazy(() => import('./pages/Updates/Updates'));
const Suggestions = React.lazy(() => import('./pages/Suggestions/StrategyWizard'));
const IndianForecast = React.lazy(() => import('./pages/Forecast/IndianForecast'));
const IPO = React.lazy(() => import('./pages/IPO/IPO'));
const IPODetails = React.lazy(() => import('./pages/IPO/IPODetails'));
const SecuritiesBond = React.lazy(() => import('./pages/SecuritiesBond/SecuritiesBond'));
const BondDetails = React.lazy(() => import('./pages/BondDetails/BondDetails'));
const CurrencyDerivatives = React.lazy(() => import('./pages/CurrencyDerivatives/CurrencyDerivatives'));
const REITS = React.lazy(() => import('./pages/REITS/REITS'));
const REITDetails = React.lazy(() => import('./pages/REITDetails/REITDetails'));
const ResultsCalendar = React.lazy(() => import('./pages/ResultsCalendar/ResultsCalendar'));

// Placeholder Pages
const PagePlaceholder = ({ title }: { title: string }) => (
  <div className="flex-1 flex flex-col items-center justify-center text-indigo-900/40 p-10">
    <div className="text-6xl mb-6 opacity-20">📊</div>
    <h2 className="text-2xl font-bold uppercase tracking-widest mb-2">{title}</h2>
    <p className="text-sm border-t border-indigo-100 pt-4">This module is currently under development.</p>
  </div>
);

function App() {
  return (
    <BrowserRouter>
        <ScrollToTop />
        <Toaster position="top-right" />
        <Suspense fallback={
          <div className="flex h-screen w-full items-center justify-center bg-indigo-50">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
              <p className="text-indigo-900/60 font-bold uppercase tracking-widest text-xs animate-pulse">Loading Platform...</p>
            </div>
          </div>
        }>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            
            <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>}>
              <Route index element={<LandingHome />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="stocks">
                <Route index element={<Stocks />} />
                <Route path=":symbol" element={<StockDetails />} />
              </Route>
              <Route path="market-analysis" element={<MarketAnalysis />} />
              <Route path="indices" element={<Indices />} />
              <Route path="index-details/:name" element={<IndexDetails />} />
              <Route path="mutual-funds">
                <Route index element={<MutualFunds />} />
                <Route path=":id" element={<MutualFundDetails />} />
              </Route>
              <Route path="etfs">
                <Route index element={<ETFs />} />
                <Route path=":id" element={<ETFDetails />} />
              </Route>
              <Route path="gold-silver">
                <Route index element={<GoldSilver />} />
                <Route path=":id" element={<GoldSilverDetails />} />
              </Route>
              <Route path="commodities">
                <Route index element={<Commodities />} />
                <Route path=":id" element={<CommodityDetails />} />
              </Route>
              <Route path="watchlist" element={<Watchlist />} />
              <Route path="profile" element={<Profile />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="stocks-in-news" element={<StocksInNews />} />
              <Route path="news/:id" element={<NewsDetails />} />
              <Route path="fii-dii" element={<FIIDII />} />
              <Route path="about" element={<About />} />
              <Route path="f-and-o" element={<FandO />} />
              <Route path="intraday-stocks">
                <Route index element={<IntradayStocks />} />
                <Route path=":id" element={<IntradayDetails />} />
              </Route>
              <Route path="ipo">
                <Route index element={<IPO />} />
                <Route path=":name" element={<IPODetails />} />
              </Route>
              <Route path="securities-bond">
                <Route index element={<SecuritiesBond />} />
                <Route path=":id" element={<BondDetails />} />
              </Route>
              <Route path="currency-derivatives" element={<CurrencyDerivatives />} />
              <Route path="reits">
                <Route index element={<REITS />} />
                <Route path=":id" element={<REITDetails />} />
              </Route>
              <Route path="results" element={<ResultsCalendar />} />
              <Route path="market-summary" element={<MarketSummary />} />
              <Route path="beginner-guide" element={<BeginnerGuide />} />
              <Route path="forecast" element={<IndianForecast />} />
              <Route path="updates" element={<Updates />} />
              <Route path="suggestions">
                <Route index element={<Suggestions />} />
                <Route path="thank-you" element={<div className="p-10 text-center"><h1 className="text-4xl font-black text-indigo-950 mb-4">Your Investment Strategy is Ready!</h1><p className="text-indigo-900/60">Based on your preferences, we have curated the best assets for your portfolio.</p></div>} />
              </Route>
              <Route path="settings" element={<PagePlaceholder title="Settings" />} />
            </Route>
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    );
}

export default App;
