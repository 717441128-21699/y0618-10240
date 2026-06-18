import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Home from '../pages/Home';
import ActivityList from '../pages/ActivityList';
import ActivityDetail from '../pages/ActivityDetail';
import ItemDetail from '../pages/ItemDetail';
import Login from '../pages/Login';
import Transparency from '../pages/Transparency';
import UserCenterLayout from '../pages/UserCenter/Layout';
import UserDashboard from '../pages/UserCenter/Dashboard';
import UserBids from '../pages/UserCenter/Bids';
import UserOrders from '../pages/UserCenter/Orders';
import UserAddresses from '../pages/UserCenter/Addresses';
import UserProfile from '../pages/UserCenter/Profile';
import OrgAdminLayout from '../pages/OrgAdmin/Layout';
import OrgDashboard from '../pages/OrgAdmin/Dashboard';
import OrgActivities from '../pages/OrgAdmin/Activities';
import OrgItems from '../pages/OrgAdmin/Items';
import OrgOrders from '../pages/OrgAdmin/Orders';
import OrgReports from '../pages/OrgAdmin/Reports';
import OrgSettings from '../pages/OrgAdmin/Settings';
import OrgSettlement from '../pages/OrgAdmin/Settlement';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/org"
          element={
            <OrgAdminLayout />
          }
        >
          <Route index element={<OrgDashboard />} />
          <Route path="activities" element={<OrgActivities />} />
          <Route path="items" element={<OrgItems />} />
          <Route path="orders" element={<OrgOrders />} />
          <Route path="reports" element={<OrgReports />} />
          <Route path="settings" element={<OrgSettings />} />
          <Route path="settlement/:activityId" element={<OrgSettlement />} />
        </Route>

        <Route
          path="/*"
          element={
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/activities" element={<ActivityList />} />
                  <Route path="/activity/:id" element={<ActivityDetail />} />
                  <Route path="/item/:id" element={<ItemDetail />} />
                  <Route path="/transparency" element={<Transparency />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Login />} />
                  
                  <Route path="/user" element={<UserCenterLayout />}>
                    <Route index element={<UserDashboard />} />
                    <Route path="bids" element={<UserBids />} />
                    <Route path="orders" element={<UserOrders />} />
                    <Route path="addresses" element={<UserAddresses />} />
                    <Route path="profile" element={<UserProfile />} />
                  </Route>
                </Routes>
              </main>
              <Footer />
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
