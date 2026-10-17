const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config();

const User = require('./models/User');
const Emergency = require('./models/Emergency');
const AssistanceRequest = require('./models/AssistanceRequest');
const VolunteerProfile = require('./models/VolunteerProfile');
const VolunteerAssignment = require('./models/VolunteerAssignment');
const ReliefCamp = require('./models/ReliefCamp');
const Resource = require('./models/Resource');
const ResourceDistribution = require('./models/ResourceDistribution');
const Announcement = require('./models/Announcement');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding...');

    // Clear existing data
    await Promise.all([
      User.deleteMany(), Emergency.deleteMany(), AssistanceRequest.deleteMany(),
      VolunteerProfile.deleteMany(), VolunteerAssignment.deleteMany(), ReliefCamp.deleteMany(),
      Resource.deleteMany(), ResourceDistribution.deleteMany(), Announcement.deleteMany()
    ]);
    console.log('All data cleared.');

    // ========== USERS ==========
    const adminUser = await User.create({
      name: 'Admin User', email: 'admin@resqlink.demo', password: 'demo1234',
      phone: '9876543210', role: 'admin', location: 'New Delhi, Delhi', latitude: 28.6139, longitude: 77.2090
    });

    const citizenUser = await User.create({
      name: 'Rahul Sharma', email: 'citizen@resqlink.demo', password: 'demo1234',
      phone: '9876543211', role: 'citizen', location: 'Patna, Bihar', latitude: 25.6093, longitude: 85.1376
    });

    const volunteerUser = await User.create({
      name: 'Priya Patel', email: 'volunteer@resqlink.demo', password: 'demo1234',
      phone: '9876543212', role: 'volunteer', location: 'Mumbai, Maharashtra', latitude: 19.0760, longitude: 72.8777
    });

    // Extra citizens
    const citizens = await User.insertMany([
      { name: 'Amit Kumar', email: 'amit@demo.com', password: bcrypt.hashSync('demo1234', 10), phone: '9123456780', role: 'citizen', location: 'Chennai, Tamil Nadu', latitude: 13.0827, longitude: 80.2707 },
      { name: 'Sneha Reddy', email: 'sneha@demo.com', password: bcrypt.hashSync('demo1234', 10), phone: '9123456781', role: 'citizen', location: 'Hyderabad, Telangana', latitude: 17.3850, longitude: 78.4867 },
      { name: 'Vikram Singh', email: 'vikram@demo.com', password: bcrypt.hashSync('demo1234', 10), phone: '9123456782', role: 'citizen', location: 'Lucknow, Uttar Pradesh', latitude: 26.8467, longitude: 80.9462 },
      { name: 'Kavitha Nair', email: 'kavitha@demo.com', password: bcrypt.hashSync('demo1234', 10), phone: '9123456783', role: 'citizen', location: 'Kochi, Kerala', latitude: 9.9312, longitude: 76.2673 },
      { name: 'Rajesh Gupta', email: 'rajesh@demo.com', password: bcrypt.hashSync('demo1234', 10), phone: '9123456784', role: 'citizen', location: 'Guwahati, Assam', latitude: 26.1445, longitude: 91.7362 },
      { name: 'Fatima Khan', email: 'fatima@demo.com', password: bcrypt.hashSync('demo1234', 10), phone: '9123456785', role: 'citizen', location: 'Bhopal, Madhya Pradesh', latitude: 23.2599, longitude: 77.4126 },
    ]);

    // Extra volunteers
    const volunteers = await User.insertMany([
      { name: 'Arjun Menon', email: 'arjun@demo.com', password: bcrypt.hashSync('demo1234', 10), phone: '9123456790', role: 'volunteer', location: 'Bangalore, Karnataka', latitude: 12.9716, longitude: 77.5946 },
      { name: 'Meera Joshi', email: 'meera@demo.com', password: bcrypt.hashSync('demo1234', 10), phone: '9123456791', role: 'volunteer', location: 'Pune, Maharashtra', latitude: 18.5204, longitude: 73.8567 },
      { name: 'Sanjay Das', email: 'sanjay@demo.com', password: bcrypt.hashSync('demo1234', 10), phone: '9123456792', role: 'volunteer', location: 'Kolkata, West Bengal', latitude: 22.5726, longitude: 88.3639 },
      { name: 'Lakshmi Rao', email: 'lakshmi@demo.com', password: bcrypt.hashSync('demo1234', 10), phone: '9123456793', role: 'volunteer', location: 'Visakhapatnam, Andhra Pradesh', latitude: 17.6868, longitude: 83.2185 },
      { name: 'Deepak Verma', email: 'deepak@demo.com', password: bcrypt.hashSync('demo1234', 10), phone: '9123456794', role: 'volunteer', location: 'Jaipur, Rajasthan', latitude: 26.9124, longitude: 75.7873 },
    ]);

    console.log('Users seeded.');

    // ========== VOLUNTEER PROFILES ==========
    const volProfile1 = await VolunteerProfile.create({
      user: volunteerUser._id, skills: ['First Aid', 'Rescue', 'Medical Support'], availability: 'Available',
      location: 'Mumbai, Maharashtra', latitude: 19.0760, longitude: 72.8777, completedAssignments: 12, totalHours: 48
    });

    const volProfiles = await VolunteerProfile.insertMany([
      { user: volunteers[0]._id, skills: ['Rescue', 'Technical Support'], availability: 'Available', location: 'Bangalore, Karnataka', latitude: 12.9716, longitude: 77.5946, completedAssignments: 8, totalHours: 32 },
      { user: volunteers[1]._id, skills: ['Food Distribution', 'Shelter Management'], availability: 'Assigned', location: 'Pune, Maharashtra', latitude: 18.5204, longitude: 73.8567, completedAssignments: 15, totalHours: 60 },
      { user: volunteers[2]._id, skills: ['Communication', 'General Volunteer'], availability: 'Available', location: 'Kolkata, West Bengal', latitude: 22.5726, longitude: 88.3639, completedAssignments: 5, totalHours: 20 },
      { user: volunteers[3]._id, skills: ['Medical Support', 'First Aid'], availability: 'Busy', location: 'Visakhapatnam, AP', latitude: 17.6868, longitude: 83.2185, completedAssignments: 10, totalHours: 40 },
      { user: volunteers[4]._id, skills: ['Transportation', 'General Volunteer'], availability: 'Available', location: 'Jaipur, Rajasthan', latitude: 26.9124, longitude: 75.7873, completedAssignments: 3, totalHours: 12 },
    ]);

    console.log('Volunteer profiles seeded.');

    // ========== EMERGENCIES ==========
    const emergencies = await Emergency.insertMany([
      { title: 'Flash Flood in Patna District', category: 'Flood', description: 'Sudden flash flood caused by heavy rainfall in Patna affecting multiple localities. Water levels rising rapidly in low-lying areas.', location: 'Patna, Bihar', latitude: 25.6093, longitude: 85.1376, severity: 'Critical', peopleAffected: 15000, contactNumber: '9876543210', status: 'In Progress', reportedBy: citizenUser._id, district: 'Patna', state: 'Bihar' },
      { title: 'Building Collapse in Dharavi', category: 'Building Collapse', description: 'A 4-story residential building collapsed in Dharavi. Multiple people feared trapped under debris. NDRF teams needed.', location: 'Dharavi, Mumbai', latitude: 19.0438, longitude: 72.8534, severity: 'Critical', peopleAffected: 200, contactNumber: '9876543211', status: 'Verified', reportedBy: citizens[0]._id, district: 'Mumbai', state: 'Maharashtra' },
      { title: 'Cyclone Alert - Odisha Coast', category: 'Cyclone', description: 'Severe cyclonic storm approaching Odisha coast. Wind speeds up to 140 km/h expected. Coastal evacuation advisory issued.', location: 'Puri, Odisha', latitude: 19.8135, longitude: 85.8312, severity: 'High', peopleAffected: 50000, contactNumber: '9876543212', status: 'Verified', reportedBy: adminUser._id, district: 'Puri', state: 'Odisha' },
      { title: 'Major Fire in Industrial Area', category: 'Fire', description: 'Fire broke out in a chemical factory in industrial zone. Toxic smoke spreading to nearby residential areas.', location: 'Ahmedabad, Gujarat', latitude: 23.0225, longitude: 72.5714, severity: 'High', peopleAffected: 5000, contactNumber: '9876543213', status: 'In Progress', reportedBy: citizens[2]._id, district: 'Ahmedabad', state: 'Gujarat' },
      { title: 'Landslide near Shimla Highway', category: 'Landslide', description: 'Heavy rainfall triggered massive landslide blocking Shimla-Manali highway. Multiple vehicles trapped.', location: 'Shimla, Himachal Pradesh', latitude: 31.1048, longitude: 77.1734, severity: 'High', peopleAffected: 300, contactNumber: '9876543214', status: 'Reported', reportedBy: citizens[3]._id, district: 'Shimla', state: 'Himachal Pradesh' },
      { title: 'Earthquake Tremors in Delhi NCR', category: 'Earthquake', description: 'Moderate earthquake of magnitude 5.2 felt across Delhi NCR. Minor cracks reported in old buildings.', location: 'New Delhi, Delhi', latitude: 28.6139, longitude: 77.2090, severity: 'Medium', peopleAffected: 200000, contactNumber: '9876543215', status: 'Verified', reportedBy: adminUser._id, district: 'New Delhi', state: 'Delhi' },
      { title: 'Road Accident on NH-44', category: 'Road Accident', description: 'Multi-vehicle collision on National Highway 44 near Hyderabad. Ambulances needed urgently.', location: 'Hyderabad, Telangana', latitude: 17.3850, longitude: 78.4867, severity: 'High', peopleAffected: 45, contactNumber: '9876543216', status: 'In Progress', reportedBy: citizens[4]._id, district: 'Hyderabad', state: 'Telangana' },
      { title: 'Medical Emergency - Dengue Outbreak', category: 'Medical Emergency', description: 'Rising dengue cases reported in multiple wards of Lucknow. Medical camps needed urgently.', location: 'Lucknow, Uttar Pradesh', latitude: 26.8467, longitude: 80.9462, severity: 'Medium', peopleAffected: 800, contactNumber: '9876543217', status: 'Verified', reportedBy: citizens[5]._id, district: 'Lucknow', state: 'Uttar Pradesh' },
      { title: 'Minor Flood - Kerala Backwaters', category: 'Flood', description: 'Seasonal flooding in Kerala backwater regions. Some areas temporarily waterlogged.', location: 'Kochi, Kerala', latitude: 9.9312, longitude: 76.2673, severity: 'Low', peopleAffected: 2000, contactNumber: '9876543218', status: 'Resolved', reportedBy: citizens[3]._id, district: 'Kochi', state: 'Kerala' },
      { title: 'Bridge Damage in Assam', category: 'Other', description: 'Historic bridge over Brahmaputra showing structural damage after prolonged flooding. Traffic suspended.', location: 'Guwahati, Assam', latitude: 26.1445, longitude: 91.7362, severity: 'Medium', peopleAffected: 10000, contactNumber: '9876543219', status: 'Reported', reportedBy: citizens[5]._id, district: 'Guwahati', state: 'Assam' },
    ]);

    console.log('Emergencies seeded.');

    // ========== ASSISTANCE REQUESTS ==========
    const requests = await AssistanceRequest.insertMany([
      { citizen: citizenUser._id, requestType: 'Rescue', description: 'Family of 6 trapped on rooftop due to rising flood water. Water level at door height and rising.', peopleCount: 6, priority: 'Critical', location: 'Patna, Bihar', latitude: 25.6193, longitude: 85.1476, contactNumber: '9876543211', status: 'Assigned', assignedVolunteer: volunteerUser._id, district: 'Patna', state: 'Bihar' },
      { citizen: citizens[0]._id, requestType: 'Food', description: 'No food available for 20 families in our colony. Children and elderly are suffering.', peopleCount: 80, priority: 'Urgent', location: 'Dharavi, Mumbai', latitude: 19.0428, longitude: 72.8544, contactNumber: '9123456780', status: 'In Progress', district: 'Mumbai', state: 'Maharashtra' },
      { citizen: citizens[1]._id, requestType: 'Medicine', description: 'Urgently need insulin and blood pressure medication for elderly residents.', peopleCount: 15, priority: 'Critical', location: 'Hyderabad, Telangana', latitude: 17.3870, longitude: 78.4887, contactNumber: '9123456781', status: 'Pending', district: 'Hyderabad', state: 'Telangana' },
      { citizen: citizens[2]._id, requestType: 'Shelter', description: 'Need temporary shelter for 30 families displaced by factory fire.', peopleCount: 120, priority: 'Urgent', location: 'Ahmedabad, Gujarat', latitude: 23.0235, longitude: 72.5724, contactNumber: '9123456782', status: 'Pending', district: 'Ahmedabad', state: 'Gujarat' },
      { citizen: citizens[3]._id, requestType: 'Drinking Water', description: 'Water supply contaminated due to landslide debris. Need clean drinking water supply.', peopleCount: 500, priority: 'Urgent', location: 'Shimla, HP', latitude: 31.1058, longitude: 77.1744, contactNumber: '9123456783', status: 'Pending', district: 'Shimla', state: 'Himachal Pradesh' },
      { citizen: citizens[4]._id, requestType: 'Medical Assistance', description: 'Multiple injured persons from road accident need immediate medical attention.', peopleCount: 20, priority: 'Critical', location: 'Hyderabad, Telangana', latitude: 17.3880, longitude: 78.4897, contactNumber: '9123456784', status: 'Assigned', assignedVolunteer: volProfiles[0].user, district: 'Hyderabad', state: 'Telangana' },
      { citizen: citizens[5]._id, requestType: 'Food', description: 'Dengue patients and their families need nutritious food supply at the medical camp.', peopleCount: 100, priority: 'Normal', location: 'Lucknow, UP', latitude: 26.8477, longitude: 80.9472, contactNumber: '9123456785', status: 'Completed', district: 'Lucknow', state: 'Uttar Pradesh' },
      { citizen: citizenUser._id, requestType: 'Transportation', description: 'Need vehicles to evacuate 50 elderly people from flood-affected old age home.', peopleCount: 50, priority: 'Urgent', location: 'Patna, Bihar', latitude: 25.6073, longitude: 85.1356, contactNumber: '9876543211', status: 'Pending', district: 'Patna', state: 'Bihar' },
      { citizen: citizens[0]._id, requestType: 'Clothing', description: 'Displaced families have lost all belongings. Need warm clothing for children.', peopleCount: 40, priority: 'Normal', location: 'Mumbai, Maharashtra', latitude: 19.0448, longitude: 72.8554, contactNumber: '9123456780', status: 'Pending', district: 'Mumbai', state: 'Maharashtra' },
      { citizen: citizens[2]._id, requestType: 'Electricity', description: 'Hospital running on backup generators. Fuel supply needed urgently for medical equipment.', peopleCount: 500, priority: 'Critical', location: 'Ahmedabad, Gujarat', latitude: 23.0215, longitude: 72.5704, contactNumber: '9123456782', status: 'In Progress', district: 'Ahmedabad', state: 'Gujarat' },
    ]);

    console.log('Assistance requests seeded.');

    // ========== RELIEF CAMPS ==========
    const camps = await ReliefCamp.insertMany([
      { name: 'Patna Central Relief Camp', address: 'Gandhi Maidan, Patna', district: 'Patna', state: 'Bihar', latitude: 25.6120, longitude: 85.1400, maxCapacity: 500, currentOccupancy: 380, contactPerson: 'Dr. Rajesh Kumar', phone: '9111111111', facilities: ['Food', 'Water', 'Beds', 'Toilets', 'Medical Support', 'Electricity'], foodAvailable: true, waterAvailable: true, medicalSupport: true, status: 'Nearly Full', createdBy: adminUser._id },
      { name: 'Mumbai Dharavi Emergency Shelter', address: 'Dharavi School Ground, Mumbai', district: 'Mumbai', state: 'Maharashtra', latitude: 19.0400, longitude: 72.8500, maxCapacity: 300, currentOccupancy: 285, contactPerson: 'Suresh Patil', phone: '9222222222', facilities: ['Food', 'Water', 'Beds', 'Toilets', 'Women & Children Area'], foodAvailable: true, waterAvailable: true, medicalSupport: false, status: 'Nearly Full', createdBy: adminUser._id },
      { name: 'Hyderabad Rescue Center', address: 'LB Stadium Complex, Hyderabad', district: 'Hyderabad', state: 'Telangana', latitude: 17.3900, longitude: 78.4800, maxCapacity: 400, currentOccupancy: 150, contactPerson: 'Asha Rani', phone: '9333333333', facilities: ['Food', 'Water', 'Beds', 'Toilets', 'Medical Support', 'Accessibility Support'], foodAvailable: true, waterAvailable: true, medicalSupport: true, status: 'Active', createdBy: adminUser._id },
      { name: 'Delhi Relief Hub', address: 'Indira Gandhi Stadium, New Delhi', district: 'New Delhi', state: 'Delhi', latitude: 28.6100, longitude: 77.2100, maxCapacity: 600, currentOccupancy: 200, contactPerson: 'Manoj Singh', phone: '9444444444', facilities: ['Food', 'Water', 'Beds', 'Toilets', 'Medical Support', 'Electricity', 'Women & Children Area'], foodAvailable: true, waterAvailable: true, medicalSupport: true, status: 'Active', createdBy: adminUser._id },
      { name: 'Kochi Flood Relief Camp', address: 'Marine Drive Ground, Kochi', district: 'Kochi', state: 'Kerala', latitude: 9.9300, longitude: 76.2700, maxCapacity: 250, currentOccupancy: 250, contactPerson: 'Thomas Varghese', phone: '9555555555', facilities: ['Food', 'Water', 'Beds', 'Toilets'], foodAvailable: true, waterAvailable: true, medicalSupport: false, status: 'Full', createdBy: adminUser._id },
      { name: 'Lucknow Dengue Relief Center', address: 'Bada Imambada Ground, Lucknow', district: 'Lucknow', state: 'Uttar Pradesh', latitude: 26.8500, longitude: 80.9500, maxCapacity: 350, currentOccupancy: 120, contactPerson: 'Dr. Sunita Agarwal', phone: '9666666666', facilities: ['Food', 'Water', 'Beds', 'Medical Support'], foodAvailable: true, waterAvailable: true, medicalSupport: true, status: 'Active', createdBy: adminUser._id },
      { name: 'Ahmedabad Industrial Zone Shelter', address: 'Naroda Industrial Estate', district: 'Ahmedabad', state: 'Gujarat', latitude: 23.0250, longitude: 72.5730, maxCapacity: 400, currentOccupancy: 50, contactPerson: 'Vikram Patel', phone: '9777777777', facilities: ['Food', 'Water', 'Beds', 'Toilets', 'Accessibility Support'], foodAvailable: false, waterAvailable: true, medicalSupport: false, status: 'Active', createdBy: adminUser._id },
    ]);

    console.log('Relief camps seeded.');

    // ========== RESOURCES ==========
    const resources = await Resource.insertMany([
      { name: 'Rice Bags (25kg)', category: 'Food', quantity: 500, unit: 'bags', storageLocation: 'Patna Central Warehouse', minimumStockLevel: 100, lastUpdatedBy: adminUser._id },
      { name: 'Drinking Water Bottles', category: 'Water', quantity: 10000, unit: 'bottles', storageLocation: 'Mumbai Distribution Center', minimumStockLevel: 2000, lastUpdatedBy: adminUser._id },
      { name: 'First Aid Kits', category: 'Medicine', quantity: 200, unit: 'kits', storageLocation: 'Delhi Medical Store', minimumStockLevel: 50, lastUpdatedBy: adminUser._id },
      { name: 'Blankets', category: 'Blankets', quantity: 800, unit: 'pieces', storageLocation: 'Kolkata Warehouse', minimumStockLevel: 200, lastUpdatedBy: adminUser._id },
      { name: 'Tarpaulins', category: 'Other', quantity: 150, unit: 'pieces', storageLocation: 'Hyderabad Distribution Hub', minimumStockLevel: 50, lastUpdatedBy: adminUser._id },
      { name: 'Emergency Torches', category: 'Rescue Equipment', quantity: 300, unit: 'pieces', storageLocation: 'Delhi Emergency Store', minimumStockLevel: 100, lastUpdatedBy: adminUser._id },
      { name: 'ORS Packets', category: 'Medicine', quantity: 5000, unit: 'packets', storageLocation: 'Patna Medical Warehouse', minimumStockLevel: 1000, lastUpdatedBy: adminUser._id },
      { name: 'Baby Food', category: 'Food', quantity: 200, unit: 'cartons', storageLocation: 'Mumbai Women Center', minimumStockLevel: 50, lastUpdatedBy: adminUser._id },
      { name: 'Hygiene Kits', category: 'Hygiene Kits', quantity: 1000, unit: 'kits', storageLocation: 'Kochi Relief Hub', minimumStockLevel: 300, lastUpdatedBy: adminUser._id },
      { name: 'Diesel Fuel', category: 'Fuel', quantity: 500, unit: 'liters', storageLocation: 'Ahmedabad Fuel Depot', minimumStockLevel: 200, lastUpdatedBy: adminUser._id },
      { name: 'Winter Jackets', category: 'Clothing', quantity: 400, unit: 'pieces', storageLocation: 'Shimla Cold Storage', minimumStockLevel: 100, lastUpdatedBy: adminUser._id },
      { name: 'Life Jackets', category: 'Rescue Equipment', quantity: 30, unit: 'pieces', storageLocation: 'Patna Rescue Store', minimumStockLevel: 50, lastUpdatedBy: adminUser._id },
    ]);

    // Fix resource statuses (insertMany skips pre-save middleware)
    for (const r of resources) {
      let status = 'Available';
      if (r.quantity <= 0) status = 'Out of Stock';
      else if (r.quantity <= r.minimumStockLevel) status = 'Low Stock';
      if (status !== r.status) {
        await Resource.findByIdAndUpdate(r._id, { status });
      }
    }
    console.log('Resources seeded and statuses corrected.');

    // ========== RESOURCE DISTRIBUTIONS ==========
    await ResourceDistribution.insertMany([
      { resource: resources[0]._id, quantityDistributed: 100, destination: 'Patna Central Relief Camp', reliefCamp: camps[0]._id, distributedBy: adminUser._id, notes: 'Emergency food supply for flood victims' },
      { resource: resources[1]._id, quantityDistributed: 2000, destination: 'Dharavi Emergency Shelter', reliefCamp: camps[1]._id, distributedBy: adminUser._id, notes: 'Clean drinking water for displaced families' },
      { resource: resources[2]._id, quantityDistributed: 50, destination: 'Hyderabad Rescue Center', reliefCamp: camps[2]._id, distributedBy: adminUser._id, notes: 'Medical kits for rescue operations' },
      { resource: resources[3]._id, quantityDistributed: 200, destination: 'Delhi Relief Hub', reliefCamp: camps[3]._id, distributedBy: adminUser._id, notes: 'Blankets for winter relief' },
      { resource: resources[6]._id, quantityDistributed: 1000, destination: 'Lucknow Dengue Relief Center', reliefCamp: camps[5]._id, distributedBy: adminUser._id, notes: 'ORS for dengue patients' },
    ]);

    console.log('Resource distributions seeded.');

    // ========== VOLUNTEER ASSIGNMENTS ==========
    await VolunteerAssignment.insertMany([
      { volunteer: volunteerUser._id, request: requests[0]._id, taskDescription: 'Rescue family trapped on rooftop in Patna flood area. Use boat if available.', assignedBy: adminUser._id, priority: 'Critical', status: 'In Progress' },
      { volunteer: volunteers[0]._id, request: requests[5]._id, taskDescription: 'Provide first aid and coordinate ambulance for road accident victims.', assignedBy: adminUser._id, priority: 'Critical', status: 'Assigned' },
      { volunteer: volunteers[1]._id, request: requests[1]._id, taskDescription: 'Coordinate food distribution for 20 families in Dharavi.', assignedBy: adminUser._id, priority: 'Urgent', status: 'In Progress' },
    ]);

    console.log('Volunteer assignments seeded.');

    // ========== ANNOUNCEMENTS ==========
    await Announcement.insertMany([
      { title: 'CRITICAL: Patna Flood Emergency', message: 'Severe flooding in Patna. All residents in low-lying areas must evacuate immediately to designated relief camps. Helpline: 1070', category: 'Flood', targetArea: 'Patna, Bihar', priority: 'Emergency', publishedBy: adminUser._id, isActive: true },
      { title: 'Cyclone Warning - Odisha Coast', message: 'Severe cyclonic storm expected to make landfall in next 24 hours. Coastal residents must move to higher ground. Emergency shelters activated.', category: 'Cyclone', targetArea: 'Odisha Coast', priority: 'Emergency', publishedBy: adminUser._id, isActive: true },
      { title: 'Dengue Awareness Drive - Lucknow', message: 'Dengue cases rising in Lucknow. Citizens should take preventive measures. Free testing camps available at all government hospitals.', category: 'Medical Emergency', targetArea: 'Lucknow, UP', priority: 'Warning', publishedBy: adminUser._id, isActive: true },
      { title: 'Volunteer Registration Drive', message: 'We need more volunteers for relief operations across Bihar and Maharashtra. Register now on ResQLink to help those in need.', category: 'General', targetArea: 'All India', priority: 'Information', publishedBy: adminUser._id, isActive: true },
      { title: 'Relief Camp Capacity Update', message: 'Patna Central Relief Camp is at 76% capacity. Please use alternative camps if available. New camp being set up at Ganga Ghat ground.', category: 'Flood', targetArea: 'Patna, Bihar', priority: 'Warning', publishedBy: adminUser._id, isActive: true },
      { title: 'Road Closure Advisory - Shimla', message: 'Shimla-Manali highway closed due to landslide. Use alternate routes via Kullu. Emergency vehicles given priority.', category: 'Landslide', targetArea: 'Shimla, HP', priority: 'Warning', publishedBy: adminUser._id, isActive: true },
    ]);

    console.log('Announcements seeded.');

    console.log('\n✅ Seed completed successfully!');
    console.log('\nDemo Accounts:');
    console.log('Admin:     admin@resqlink.demo / demo1234');
    console.log('Citizen:   citizen@resqlink.demo / demo1234');
    console.log('Volunteer: volunteer@resqlink.demo / demo1234');

    if (require.main === module) process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    if (require.main === module) process.exit(1);
    throw error;
  }
};

// Only run directly (not when required as a module)
if (require.main === module) {
  seed();
}

module.exports = seed;
