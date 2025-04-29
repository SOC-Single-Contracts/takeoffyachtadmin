import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Transactions from "../pages/Transactions";
import Listings from "../pages/Listings";
import NotFound from "../pages/NotFound";
import Settings from "../pages/Settings";
import Help from "../pages/Help";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import Layout from "./Layout";
import AddNewYacht from "../pages/AddNewYacht";
import EditProfile from "../components/profile/EditProfile";
import Inclusions from "../pages/inclusions/Inclusions";
import Specifications from "../components/specifications/Specifications";
import ProtectedRoute from "./ProtectedRoute";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";

// Boat Components
import Boats from "../components/boats/Boats";
import AddBoat from "../components/boats/AddBoat";
import F1Boats from "../components/boats/F1Boats";
import AddF1Boat from "../components/boats/AddF1Boat";
import NewYearBoats from "../components/boats/NewYearBoats";
import AddNewYearBoat from "../components/boats/AddNewYearBoat";

// Brand Components
import Brands from "../components/brands/Brands";
import AddBrand from "../components/brands/AddBrand";

// Category Components
import Categories from "../pages/categories/Categories";
import AddCategory from "../pages/categories/AddCategory";

// Feature Components
import Features from "../components/features/Features";
import AddFeature from "../components/features/AddFeature";

// Food Menu Components
import FoodMenu from "../components/extras/FoodMenu";

// Merchant Components
import Merchants from "../components/merchants/Merchants";
import AddMerchant from "../components/merchants/AddMerchant";
import AddBlogs from "../pages/blogs/AddBlog";
import AllBlogs from "../pages/blogs/AllBlogs";
import Inbox from "../pages/chat/chat";
import Users from "../components/users/Users";
import AddUser from "../components/users/AddUser";
import AddInclusion from "../pages/inclusions/AddInclusions";
import AddSpecifications from "../components/specifications/AddSpecifications";
import BoatBookings from "../pages/booking/BoatBooking";
import EventBookings from "../pages/booking/EventBooking";
import AddExtras from "../components/extras/AddExtras";
import Miscellaneous from "../components/extras/Miscellaneous";
import WaterSports from "../components/extras/WaterSports";
import AllExtras from "../components/extras/AllExtras";

// Testimonial Components
import TestimonialList from "../components/testimonials/TestimonialList";
import AddEditTestimonial from "../components/testimonials/AddEditTestimonial";

// Experience Components
import AllExperiences from '../components/experiences/AllExperiences';
import AddExperience from '../components/experiences/AddExperience';

// Event Components
import AllEvents from '../components/events/EventList';
import AddEvent from '../components/events/AddEvent';
import PackageList from "../components/events/PackageList";
import EditBoat from "../components/boats/EditBoat";
import EditF1Boat from "../components/boats/EditF1Boat";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        {/* <Route path="/signup" element={<Signup />} /> */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:userId" element={<ResetPassword />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="listings" element={<Listings />} />
          <Route path="settings" element={<Settings />} />
          <Route path="help" element={<Help />} />
          <Route path="add-yacht" element={<AddNewYacht />} />
          <Route path="edit-profile" element={<EditProfile />} />
          <Route path="inclusions" element={<Inclusions />} />
          <Route path="specifications" element={<Specifications />} />
          <Route path="packages" element={<PackageList />} />
          
          {/* Boats Routes */}
          <Route path="boats/yachts" element={<Boats />} />
          <Route path="boats/yachts/add" element={<AddBoat />} />
          <Route path="boats/yachts/edit/:id" element={<EditBoat />} />
          <Route path="boats/f1yachts" element={<F1Boats />} />
          <Route path="boats/f1yachts/add" element={<AddF1Boat />} />
          <Route path="boats/f1yachts/edit/:id" element={<EditF1Boat />} />
          <Route path="boats/newyear" element={<NewYearBoats />} />
          <Route path="boats/newyear/add" element={<AddNewYearBoat />} />
          <Route path="boats/newyear/edit/:id" element={<AddNewYearBoat />} />
          
          {/* Brands Routes */}
          <Route path="brands" element={<Brands />} />
          <Route path="brands/add" element={<AddBrand />} />
          <Route path="brands/edit/:id" element={<AddBrand />} />
          
          {/* Categories Routes */}
          <Route path="categories" element={<Categories />} />
          <Route path="categories/add" element={<AddCategory />} />
          
          {/* Features Routes */}
          <Route path="features" element={<Features />} />
          <Route path="features/add" element={<AddFeature />} />
          
          {/* Food Menu Routes */}
          <Route path="extras/food-and-beverages" element={<FoodMenu />} />
          <Route path="extras/water-sports" element={<WaterSports />} />
          <Route path="extras/misc" element={<Miscellaneous />} />
          <Route path="extras/add" element={<AddExtras />} />
          <Route path="extras" element={<AllExtras />} />
          
          {/* Merchants Routes */}
          <Route path="merchants" element={<Merchants />} />
          <Route path="merchants/add" element={<AddMerchant />} />
          
          {/* Blog Routes */}
          <Route path="blogs" element={<AllBlogs />} />
          <Route path="blogs/add" element={<AddBlogs />} />
          <Route path="blogs/add/:id" element={<AddBlogs />} />
          
          {/* Testimonial Routes */}
          <Route path="testimonials" element={<TestimonialList />} />
          <Route path="testimonials/add" element={<AddEditTestimonial />} />
          <Route path="testimonials/edit/:id" element={<AddEditTestimonial />} />
          
          {/* Experience Routes */}
          <Route path="experiences" element={<AllExperiences />} />
          <Route path="experiences/add" element={<AddExperience />} />
          <Route path="experiences/edit/:id" element={<AddExperience />} />
          
          {/* Event Routes */}
          <Route path="events" element={<AllEvents />} />
          <Route path="events/add" element={<AddEvent />} />
          <Route path="events/edit/:id" element={<AddEvent />} />
          
          {/* Other Routes */}
          <Route path="chat" element={<Inbox />} />
          <Route path="users" element={<Users />} />
          <Route path="users/add" element={<AddUser />} />
          <Route path="inclusions/add" element={<AddInclusion />} />
          <Route path="inclusions/edit/:id" element={<AddInclusion />} />
          <Route path="specifications/add" element={<AddSpecifications />} />
          <Route path="specifications/edit/:id" element={<AddSpecifications />} />
          <Route path="boat-bookings" element={<BoatBookings />} />
          <Route path="event-bookings" element={<EventBookings />} />
        </Route>

        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
