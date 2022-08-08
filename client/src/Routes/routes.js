import Booking from "../Components/customer/Pages/Booking/Booking";
import Appointment from "../Components/customer/Pages/Appointment/Appointment"
import Checkout from "../Components/customer/Pages/Checkout/Checkout";
import SearchResult from "../Components/customer/Pages/Shops/Shops";
import ShopView from "../Components/customer/Pages/ShopView/ShopView";
import Spa from "../Components/customer/Pages/Service/Spa/Spa";
import Hairdresser from "../Components/customer/Pages/Service/Haidresser/Hairdresser";
import Beautician from "../Components/customer/Pages/Service/Beautician/Beautician";
import Barber from "../Components/customer/Pages/Service/Barber/Barber";
import Dentist from "../Components/customer/Pages/Service/Dentist/Dentist";
import Doctor from "../Components/customer/Pages/Service/Doctor/Doctor";
import Home from "../Components/customer/Pages/Home/Home";
import Account from "../Components/customer/Pages/MyAccount/Account"


import Dashboard from "../Components/Admin/Pages/dashboard/ecommerce";
import AdminVendor from "../Components/Admin/Pages/adminvendor/vendor";
import AdminCustomers from "../Components/Admin/Pages/adminCustomer/customer";
import AdminSubscription from "../Components/Admin/Pages/Subscript/Subscription";

// Vendor Routes
import EcommerceDashboard from "../Components/vendor/Pages/dashboard/ecommerce";
import Service from "../Components/vendor/Pages/Service/Service";
import Staff from "../Components/vendor/Pages/Staff/Staff";
import CalendarBooking from "../Components/vendor/Pages/CalendarBooking/CalendarBooking";
import Review from "../Components/vendor/Pages/Review/Review";
import BookingVendor from "../Components/vendor/Pages/BookingVendor/BookingVendor";
import Package from "../Components/Admin/Pages/Package/Package";
import Setting from "../Components/vendor/Pages/Setting/Setting";
import Category from "../Components/vendor/Pages/Category/Category";
import Gallery from "../Components/vendor/Pages/Gallery/Gallery";
import Table from "../Components/vendor/Pages/Table";
export const MainLayoutPath = [
	{
		path: '/booking',
		component: Booking
	},
	{
		path: '/checkout',
		component: Checkout
	},
	{
		path: "/Account",
		component: Account
	},
	{
		path: '/appointment/:id',
		component: Appointment
	},
	{
		path: '/service/:id',
		component: ShopView
	},
	{
		path: '/result',
		component: SearchResult
	},
	{
		path: '/spa',
		component: Spa
	},
	{
		path: '/hairdresser',
		component: Hairdresser
	},
	{
		path: '/beautician',
		component: Beautician
	},
	{
		path: '/barber',
		component: Barber
	},
	{
		path: '/dentist',
		component: Dentist
	},
	{
		path: '/doctor',
		component: Doctor
	},
	{
		path: '/',
		component: Home,
		exact: true
	}
]

export const VendorLayoutPath = [
	{
		path: 'dashboard',
		component: EcommerceDashboard
	},
	{
		path: 'service',
		component: Service
	},
	{
		path: 'staff',
		component: Staff
	},
	{
		path: 'calendar',
		component: CalendarBooking
	},
	{
		path: 'review',
		component: Review
	},
	{
		path: 'online-booking',
		component: BookingVendor
	},
	{
		path: 'category',
		component: Category
	},
	{
		path: 'gallery',
		component: Gallery
	},
	{
		path: 'settings',
		component: Setting
	},
	{
		path: 'table',
		component: Table
	}
]

export const AdminLayoutPath = [
	{
		path: 'dashboard',
		component: Dashboard
	},
	{
		path: 'vendor',
		component: AdminVendor
	},
	{
		path: 'customer',
		component: AdminCustomers
	},
	{
		path: 'subscription',
		component: AdminSubscription
	},
	{
		path: 'package',
		component: Package
	}

]
