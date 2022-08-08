import express from "express";
import validate from "../middleware/validate";
import upload from "../middleware/multer";
import userController from '../controller/user.controller';
import shopController from '../controller/customer/shop.controller';
import appointmentController from '../controller/customer/appointment.controller';
import staffController from '../controller/customer/staff.controller';
import serviceVendorController from '../controller/vendor/service.controller';
import staffVendorController from '../controller/vendor/staff.controller';
import appointmentVendorController from '../controller/vendor/appointment.controller';
import galleryVendorController from '../controller/vendor/gallery.controller';
import shopVendorController from '../controller/vendor/shop.controller';
import adminVendorController from '../controller/admin/vendor.controller';
import adminCustomerController from '../controller/admin/customer.controller';
import adminSubscriptionController from '../controller/admin/subscription.controller';
import vendorReviewController from '../controller/vendor/review.controller';
import reviewController from '../controller/customer/review.controller';
import vendorSubscriptionController from '../controller/vendor/subscription.controller';
import vendorDashboardController from '../controller/vendor/dashboard.controller';
import adminPackageController from '../controller/admin/package.controller';

import auth from "../middleware/auth";

const router = express.Router();

const uploadMultiple = upload.fields([
	{ name: 'shopImage', maxCount: 10 },
	{ name: 'shopBannerImage', maxCount: 10 },
	{ name: 'gallery', maxCount: 10}
])

router.post('/standard-subscribe', auth,vendorSubscriptionController.StandardSubscribe);
router.get('/packages',vendorSubscriptionController.showAllPackage);
/* ----------------------   User Controller  ---------------------- */
router.post('/register', validate('createUser') ,userController.register);
router.post('/login', validate('loginUser') ,userController.login);
router.get('/get-current', auth,userController.getCurrentUser);
router.put('/user', auth,userController.editUser);
router.post('/reset-link',userController.forgotPassword);
router.get('/authenticate/:id',userController.authenticate);
router.put('/reset-password/:id',userController.resetPassword);


/* ----------------------   Shop Controller  ---------------------- */
router.get('/shops', shopController.index);
router.get('/shop/:id', shopController.show);
router.post('/shop', shopController.create);
router.get('/shop-categories/:id', shopController.getAllCategory);
router.get('/shop-services/:id', shopController.getService)
router.get('/featured-shops', shopController.featuredShops);
router.get('/shop-name/:id', shopController.getShopName);

/* ----------------------   Staff Controller  ---------------------- */
router.get('/staffs/:id', staffController.index);
router.get('/staff/:id', staffController.show);

/* ----------------------   Appointment Controller  ---------------------- */
router.get('/pending-appointments', auth,appointmentController.pendingAppointment);
router.get('/completed-appointments', auth,appointmentController.completedAppointment)
router.get('/appointment/:id', appointmentController.disabledDays)
router.post('/appointment', appointmentController.create)
router.get('/time-slot/:id', appointmentController.timeSlots);

/* ----------------------   Service Controller  ---------------------- */
router.post('/vendor/service', auth,serviceVendorController.create);
router.get('/vendor/service', auth,serviceVendorController.index);
router.put('/vendor/service/:id', serviceVendorController.update);
router.get('/vendor/service/:id', serviceVendorController.show);
router.delete('/vendor/service/:id', auth,serviceVendorController.delete);



router.post('/vendor/staff', auth,upload.single('profilePicture'),staffVendorController.create);
router.put('/vendor/staff/:id', auth,upload.single('profilePicture'),staffVendorController.update);

router.get('/vendor/staff-services', auth,staffVendorController.getStaffServices);
router.get('/vendor/staff-categories', auth,staffVendorController.categoryOption);
router.post('/vendor/staff-categories', auth,staffVendorController.addCategoryOption);
router.get('/vendor/staff', auth,staffVendorController.getStaff);
router.get('/vendor/staffs', auth,staffVendorController.index);
router.put('/vendor/staff/:id', auth,upload.single('profilePicture'),staffVendorController.update);
router.delete('/vendor/staff/:id', auth, staffVendorController.delete);
router.get('/vendor/staff/:id', auth ,staffVendorController.getSingleStaff);
router.get('/vendor/staff-edit/:id', auth ,staffVendorController.getStaffForEdit);

router.get('/vendor/appointments', auth, appointmentVendorController.index);
router.get('/vendor/appointments-pending', auth, appointmentVendorController.getPendingAppointment);
router.get('/vendor/appointments-cancelled', auth, appointmentVendorController.getCancelledAppointment);
router.get('/vendor/appointments-completed', auth, appointmentVendorController.getCompletedAppointment);

router.put('/vendor/appointment-complete/:id',appointmentVendorController.updateCompletedAppointment);
router.put('/vendor/appointment-pending/:id',appointmentVendorController.updatePendingAppointment);
router.put('/vendor/appointment-cancelled/:id',appointmentVendorController.updateCancelledAppointment);


router.post('/vendor/shop', auth,uploadMultiple,shopVendorController.create);

router.get('/vendor/shop',auth,shopVendorController.show);

router.get('/vendor/shop-images', auth,shopVendorController.getAllImages);
router.get('/vendor/shop-timing', auth, shopVendorController.getShopTiming);


router.put('/vendor/shop',auth, shopVendorController.edit);
router.get('/vendor/shop-categories',auth,serviceVendorController.allCategories);
router.delete('/vendor/shop-categories',auth,serviceVendorController.deleteCategories);


router.put('/vendor/main-image', auth,upload.single('shopImage'), galleryVendorController.editMainImage);
router.put('/vendor/banner-image', auth,upload.single('shopBannerImage'), galleryVendorController.editBannerImage);
router.put('/vendor/gallery-image', auth,upload.array('gallery'), galleryVendorController.editGalleryImage);
router.put('/vendor/delete-image/:id', auth, galleryVendorController.deleteGalleryImage);


router.get('/admin/vendors', adminVendorController.index);
router.get('/admin/active-vendors', adminVendorController.getActiveVendors);
router.get('/admin/active-inactive', adminVendorController.getInActiveVendors);
router.get('/admin/active-blocked', adminVendorController.getBlockedVendors);
router.get('/admin/active-featured', adminVendorController.getFeaturedVendors);
router.put('/admin/to-active/:id', adminVendorController.toActive);
router.put('/admin/to-inactive/:id', adminVendorController.toInActive);
router.put('/admin/to-blocked/:id', adminVendorController.toBlocked);
router.put('/admin/to-featured/:id', adminVendorController.toFeatured);


router.get('/admin/customers', adminCustomerController.index)


router.get('/admin/subscription', adminSubscriptionController.getAllSubscriptions);
router.get('/admin/subscription-paid', adminSubscriptionController.getPaidSubscriptions);
router.get('/admin/subscription-unpaid', adminSubscriptionController.getUnPaidSubscriptions);


/* ----------------------   Review Controller  ---------------------- */
router.post('/review/:id', reviewController.create);
router.get('/reviews/:id', reviewController.index)
router.get('/reviews-rated/:id', reviewController.getReviewByRating);

/* ----------------------  Vendor Review Controller  ---------------------- */
router.get('/vendor/reviews', auth,vendorReviewController.index);
router.get('/vendor/visible-review', auth,vendorReviewController.getVisibleReview);
router.get('/vendor/hidden-review', auth,vendorReviewController.getHiddenReview);
router.put('/vendor/to-visible/:id', vendorReviewController.toVisible);
router.put('/vendor/to-hidden/:id', vendorReviewController.toHidden);

/* ----------------------   Review Controller  ---------------------- */
router.post('/vendor/subscription', auth, vendorSubscriptionController.create);


/* ----------------------  Vendor Dashboard Controller  x---------------------- */

router.get('/vendor/recent-appointments', auth, vendorDashboardController.getPreviousAppointment);
router.get('/vendor/today-appointments', auth, vendorDashboardController.todayAppointments);
router.get('/vendor/count-appointments', auth, vendorDashboardController.countAppointment);
router.get('/vendor/sales-appointments', auth, vendorDashboardController.salesAppointments);


/* ----------------------  Admin Package Controller  x---------------------- */
router.get('/admin/packages', auth, adminPackageController.index);
router.post('/admin/package', auth, adminPackageController.create);
// router.put('/admin/package/:id', auth, adminPackageController.update);



router.get('/barber-shop', shopController.getAllBarberShop);
router.get('/doctor-shop', shopController.getAllDoctorShop);
router.get('/beautician-shop', shopController.getAllBeauticianShop);
router.get('/dentist-shop', shopController.getAllDentistShop);
router.get('/hairdresser-shop', shopController.getAllDentistShop);
router.get('/spa-shop', shopController.getAllDentistShop);


export default router;
