// backend/seedStudents.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

dotenv.config();

const sem3StudentsRaw = [
  { regNo: 'EG/2023/5456', name: 'ABERATHNA M.W.G.S.' },
  { regNo: 'EG/2023/5459', name: 'ABEYRATHNA B.K.M.O.' },
  { regNo: 'EG/2023/5472', name: 'AKALANKA K.A.M.S.' },
  { regNo: 'EG/2023/5473', name: 'ALOKA J.A.S.A.' },
  { regNo: 'EG/2023/5475', name: 'AMARASINGHA N.G.S.J.' },
  { regNo: 'EG/2023/5476', name: 'AMILA W.A.H.' },
  { regNo: 'EG/2023/5486', name: 'ARAMPOLA A.M.D.T.' },
  { regNo: 'EG/2023/5492', name: 'ATHAPATHTHU A.W.M.S.P.' },
  { regNo: 'EG/2023/5503', name: 'BANDARA A.M.L.E.' },
  { regNo: 'EG/2023/5511', name: 'BANDARA I.B.A.R.C.S.I.' },
  { regNo: 'EG/2023/5512', name: 'BANDARA K.A.A.S.' },
  { regNo: 'EG/2023/5513', name: 'BANDARA K.A.L.S.' },
  { regNo: 'EG/2023/5516', name: 'BANDARA K.N.M.K.M.' },
  { regNo: 'EG/2023/5519', name: 'BANDARA M.M.M.T.' },
  { regNo: 'EG/2023/5524', name: 'BANDARA R.G.C.J.' },
  { regNo: 'EG/2023/5526', name: 'BANDARA W.M.M.B.I.' },
  { regNo: 'EG/2023/5529', name: 'BHAGYA D.D.R.' },
  { regNo: 'EG/2023/5530', name: 'BIHANSA U.G.G.' },
  { regNo: 'EG/2023/5531', name: 'CHAMARA M.G.R.' },
  { regNo: 'EG/2023/5536', name: 'CHAMODHYA P.N.V.R.' },
  { regNo: 'EG/2023/5543', name: 'DANUSAN R.' },
  { regNo: 'EG/2023/5547', name: 'DE SILVA D.A.P.' },
  { regNo: 'EG/2023/5553', name: 'DESHAPPRIYA V.G.A.I.U.K.' },
  { regNo: 'EG/2023/5554', name: 'DESHAPRIYA G.M.C.R.' },
  { regNo: 'EG/2023/5555', name: 'DESHAPRIYA P.D.T.' },
  { regNo: 'EG/2023/5557', name: 'DHANANJANA S.W.A.P.' },
  { regNo: 'EG/2023/5558', name: 'DHARMAKEERTHI T.C.' },
  { regNo: 'EG/2023/5573', name: 'DINUSHEN G.' },
  { regNo: 'EG/2023/5585', name: 'EKANAYAKA M.R.D.S.M.' },
  { regNo: 'EG/2023/5599', name: 'GAMAGE N.V.G.S.G.V.' },
  { regNo: 'EG/2023/5600', name: 'GAMAGE P.G.N.U.' },
  { regNo: 'EG/2023/5601', name: 'GAMAGE T.G.T.M.' },
  { regNo: 'EG/2023/5603', name: 'GAMLATH G.R.K.C.' },
  { regNo: 'EG/2023/5605', name: 'GAMMUDALI H.M.K.R.' },
  { regNo: 'EG/2023/5608', name: 'GOBEESAN K.' },
  { regNo: 'EG/2023/5611', name: 'GUNARATHNA G.A.M.N.S.' },
  { regNo: 'EG/2023/5613', name: 'GUNARATHNA P.M.W.' },
  { regNo: 'EG/2023/5614', name: 'GUNARATHNA R.I.U.' },
  { regNo: 'EG/2023/5615', name: 'GUNARATHNA W.H.S.S.B.' }
];

const sem4StudentsRaw = [
  { regNo: 'EG/2023/5485', name: 'ARAFATH A.M.M.' },
  { regNo: 'EG/2023/5487', name: 'ARIYARATHNE I.H.A.P.' },
  { regNo: 'EG/2023/5493', name: 'ATHTHANAYAKA A.M.R.M.' },
  { regNo: 'EG/2023/5495', name: 'ATHUKORALA L.A.K.V.L.' },
  { regNo: 'EG/2023/5497', name: 'AYAD M.A.M' },
  { regNo: 'EG/2023/5505', name: 'BANDARA D.A.K.K.' },
  { regNo: 'EG/2023/5506', name: 'BANDARA D.A.M.P.' },
  { regNo: 'EG/2023/5520', name: 'BANDARA M.M.P.C.' },
  { regNo: 'EG/2023/5527', name: 'BANTHILA W.K.' },
  { regNo: 'EG/2023/5528', name: 'BASNAYAKA B.M.V.H.' },
  { regNo: 'EG/2023/5538', name: 'CHATHURIKA K.G.I.' },
  { regNo: 'EG/2023/5542', name: 'DANDENIYA D.A.D.M.L.' },
  { regNo: 'EG/2023/5545', name: 'DAYARATHNE K.E.S.S.' },
  { regNo: 'EG/2023/5548', name: 'DE SILVA D.P.L.C.L.' },
  { regNo: 'EG/2023/5550', name: 'DE SILVA Y.D.N.' },
  { regNo: 'EG/2023/5556', name: 'DEWMINI K.K.' },
  { regNo: 'EG/2023/5561', name: 'DIAS K.M.G.P.H.' },
  { regNo: 'EG/2023/5564', name: 'DILHARA G.H.P.' },
  { regNo: 'EG/2023/5583', name: 'EDIRISINGHE E.A.T.C.' },
  { regNo: 'EG/2023/5588', name: 'EPA W.S.S.' },
  { regNo: 'EG/2023/5591', name: 'FERNANDO C.S.K.' },
  { regNo: 'EG/2023/5596', name: 'FERNANDO W.A.W.S.' },
  { regNo: 'EG/2023/5609', name: 'GOBITHAN M.' },
  { regNo: 'EG/2023/5612', name: 'GUNARATHNA H.I.J.' },
  { regNo: 'EG/2023/5616', name: 'GUNARATNE G.D.I.A.' },
  { regNo: 'EG/2023/5617', name: 'GUNASEKARA T.K.R.' },
  { regNo: 'EG/2023/5636', name: 'HERATH K.H.M.H.D.D.' },
  { regNo: 'EG/2023/5645', name: 'ILHAM M.I.M.' },
  { regNo: 'EG/2023/5659', name: 'JAYASENA N.H.' },
  { regNo: 'EG/2023/5660', name: 'JAYASINGHE J.D.A.P.' },
  { regNo: 'EG/2023/5675', name: 'KARIYAWASAM K.T.L.S.D.' },
  { regNo: 'EG/2023/5677', name: 'KARUNARATHNE K.V.T.' },
  { regNo: 'EG/2023/5684', name: 'KODITHUWAKKU C.U.' },
  { regNo: 'EG/2023/5685', name: 'KOHONA K.A.W.R.K.B.' },
  { regNo: 'EG/2023/5692', name: 'KUMARA K.M.C.S.' },
  { regNo: 'EG/2023/5696', name: 'KUMARA S.D.P.' },
  { regNo: 'EG/2023/5698', name: 'KUMARASINGHE D.K.M.S.U.' },
  { regNo: 'EG/2023/5700', name: 'KURUPPU K.A.H.B.' },
  { regNo: 'EG/2023/5725', name: 'MADUWANTHA M.P.M.' }
];

const parseName = (rawName) => {
  const parts = rawName.trim().split(' ');
  const lastName = parts[0];
  const firstName = parts.slice(1).join(' ') || lastName;
  return { firstName, lastName };
};

const makeEmail = (regNo) => {
  // E.g., 'EG/2023/5456' -> 'eg20235456@eng.ruh.ac.lk'
  const clean = regNo.toLowerCase().replace(/[^a-z0-9]/g, '');
  return `${clean}@eng.ruh.ac.lk`;
};

const seedStudents = async () => {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected successfully.');

    // 1. Ensure Admin & Lab Officer Accounts exist
    const staffAccounts = [
      {
        userId: 'ADM001',
        regNo: 'ADM001',
        firstName: 'System',
        lastName: 'Admin',
        uniEmail: 'admin@eng.ruh.ac.lk',
        password: 'password123',
        dept: 'DEIE',
        role: 'Admin'
      },
      {
        userId: 'LAB001',
        regNo: 'LAB001',
        firstName: 'Lab',
        lastName: 'Officer',
        uniEmail: 'officer@eng.ruh.ac.lk',
        password: 'password123',
        dept: 'DEIE',
        role: 'LabAssistant'
      }
    ];

    for (const staff of staffAccounts) {
      const exists = await User.findOne({ uniEmail: staff.uniEmail });
      if (!exists) {
        await User.create(staff);
      }
    }

    // 2. Prepare Sem 3 and Sem 4 student documents
    const studentDocs = [];

    sem3StudentsRaw.forEach((s) => {
      const { firstName, lastName } = parseName(s.name);
      studentDocs.push({
        userId: s.regNo,
        regNo: s.regNo,
        firstName,
        lastName,
        uniEmail: makeEmail(s.regNo),
        password: 'password123',
        dept: 'DEIE',
        semester: 3,
        role: 'Student'
      });
    });

    sem4StudentsRaw.forEach((s) => {
      const { firstName, lastName } = parseName(s.name);
      studentDocs.push({
        userId: s.regNo,
        regNo: s.regNo,
        firstName,
        lastName,
        uniEmail: makeEmail(s.regNo),
        password: 'password123',
        dept: 'DEIE',
        semester: 4,
        role: 'Student'
      });
    });

    // Also preserve or create the convenient test student Akila Jayan
    studentDocs.push({
      userId: 'STU001',
      regNo: 'EG/2023/5000',
      firstName: 'Akila',
      lastName: 'Jayan',
      uniEmail: 'akila@eng.ruh.ac.lk',
      password: 'password123',
      dept: 'DEIE',
      semester: 3,
      role: 'Student'
    });

    console.log(`Processing ${studentDocs.length} student records...`);
    let createdCount = 0;
    let updatedCount = 0;

    for (const doc of studentDocs) {
      const existing = await User.findOne({
        $or: [{ userId: doc.userId }, { uniEmail: doc.uniEmail }, { regNo: doc.regNo }]
      });

      if (!existing) {
        await User.create(doc);
        createdCount++;
      } else {
        existing.regNo = doc.regNo;
        existing.semester = doc.semester;
        existing.firstName = doc.firstName;
        existing.lastName = doc.lastName;
        await existing.save();
        updatedCount++;
      }
    }

    console.log(`Seeding complete: ${createdCount} new students created, ${updatedCount} existing updated.`);
    console.log(`Total students now in database: ${await User.countDocuments({ role: 'Student' })}`);
    process.exit(0);
  } catch (err) {
    console.error('Error seeding student database:', err);
    process.exit(1);
  }
};

seedStudents();
