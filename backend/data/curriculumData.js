const practicalCurriculum = [
  // -------------------------------------------------------------
  // EE3301 - Analog Electronics (Sem 3)
  // Location: Electronics and Measurements Laboratory
  // -------------------------------------------------------------
  {
    sessionId: 'SESS-EE3301-L1',
    courseCode: 'EE3301',
    courseName: 'Analog Electronics',
    semester: 3,
    labNumber: 1,
    title: 'The Operation of Semiconductor Diodes and their Practical Applications',
    labName: 'Electronics and Measurements Laboratory',
    worktable: 'Worktable 2',
    scheduledDaysOffset: 1,
    timeSlot: '09:00 - 12:00',
    requiredEquipment: [
      { name: 'Solderless Prototyping Breadboard', quantityRequired: 1, isConsumable: false },
      { name: 'Triple-Output Precision DC Bench Power Supply', quantityRequired: 1, isConsumable: false },
      { name: '1N4007 Silicon Rectifier Diode', quantityRequired: 4, isConsumable: true },
      { name: '1N4733A 5.1V 1W Zener Diode', quantityRequired: 2, isConsumable: true },
      { name: '1/4W Metal Film Resistors (470Ω, 1kΩ, 100kΩ)', quantityRequired: 6, isConsumable: true },
      { name: 'Electrolytic Capacitors (10µF, 47µF)', quantityRequired: 4, isConsumable: true },
      { name: '230V / 6V Step-Down Center-Tapped Transformer', quantityRequired: 1, isConsumable: false },
      { name: 'Arbitrary Waveform / Function Generator', quantityRequired: 1, isConsumable: false },
      { name: 'Dual-Trace Analog Cathode Ray Oscilloscope (CRO)', quantityRequired: 1, isConsumable: false }
    ]
  },
  {
    sessionId: 'SESS-EE3301-L2',
    courseCode: 'EE3301',
    courseName: 'Analog Electronics',
    semester: 3,
    labNumber: 2,
    title: 'Basic Amplifiers and Biasing',
    labName: 'Electronics and Measurements Laboratory',
    worktable: 'Worktable 3',
    scheduledDaysOffset: 4,
    timeSlot: '13:00 - 16:00',
    requiredEquipment: [
      { name: 'Dual-Trace Analog Cathode Ray Oscilloscope (CRO)', quantityRequired: 1, isConsumable: false },
      { name: 'Arbitrary Waveform / Function Generator', quantityRequired: 1, isConsumable: false },
      { name: 'True RMS Industrial Handheld Multimeter', quantityRequired: 1, isConsumable: false },
      { name: 'Triple-Output Precision DC Bench Power Supply', quantityRequired: 1, isConsumable: false },
      { name: '2N2222A NPN Bipolar Junction Transistor', quantityRequired: 2, isConsumable: true },
      { name: 'Rotary Carbon Potentiometer 1 MΩ (Linear)', quantityRequired: 1, isConsumable: false },
      { name: '1/4W Metal Film Resistors Assortment', quantityRequired: 8, isConsumable: true },
      { name: 'Electrolytic & Film Capacitors Kit', quantityRequired: 4, isConsumable: true },
      { name: 'Solderless Prototyping Breadboard', quantityRequired: 1, isConsumable: false },
      { name: 'Analog DC Milli-Ammeter (0-100 mA)', quantityRequired: 1, isConsumable: false },
      { name: 'Analog DC Micro-Ammeter (0-100 µA)', quantityRequired: 1, isConsumable: false }
    ]
  },
  {
    sessionId: 'SESS-EE3301-L3',
    courseCode: 'EE3301',
    courseName: 'Analog Electronics',
    semester: 3,
    labNumber: 3,
    title: 'Operational Amplifiers and Applications',
    labName: 'Electronics and Measurements Laboratory',
    worktable: 'Worktable 4',
    scheduledDaysOffset: 8,
    timeSlot: '09:00 - 12:00',
    requiredEquipment: [
      { name: 'LM741 General Purpose Op-Amp', quantityRequired: 2, isConsumable: true },
      { name: 'Metal Film Resistors (1kΩ, 10kΩ, 18kΩ, 1MΩ)', quantityRequired: 8, isConsumable: true },
      { name: 'Triple-Output Precision DC Bench Power Supply', quantityRequired: 1, isConsumable: false },
      { name: 'Precision Film & Ceramic Capacitor Kit (0.001µF to 2.2µF)', quantityRequired: 2, isConsumable: true },
      { name: 'Solderless Prototyping Breadboard', quantityRequired: 1, isConsumable: false },
      { name: 'True RMS Industrial Handheld Multimeter', quantityRequired: 1, isConsumable: false },
      { name: 'Assorted Pre-cut Jumper Wire Kits', quantityRequired: 1, isConsumable: false },
      { name: 'Arbitrary Waveform / Function Generator', quantityRequired: 1, isConsumable: false },
      { name: 'Digital Storage Oscilloscope with Waveform Recorder', quantityRequired: 1, isConsumable: false }
    ]
  },
  {
    sessionId: 'SESS-EE3301-L4',
    courseCode: 'EE3301',
    courseName: 'Analog Electronics',
    semester: 3,
    labNumber: 4,
    title: 'Oscillators and Analog Filters',
    labName: 'Electronics and Measurements Laboratory',
    worktable: 'Worktable 5',
    scheduledDaysOffset: 11,
    timeSlot: '13:00 - 16:00',
    requiredEquipment: [
      { name: 'BC108 NPN Silicon Bipolar Transistor', quantityRequired: 2, isConsumable: true },
      { name: 'RF Choke Inductor 40 µH', quantityRequired: 1, isConsumable: false },
      { name: 'RF Choke Inductor 5.5 µH', quantityRequired: 1, isConsumable: false },
      { name: 'Rotary Carbon Potentiometer 200 kΩ (Linear)', quantityRequired: 1, isConsumable: false },
      { name: 'Precision Film & Ceramic Capacitor Kit (0.001µF to 2.2µF)', quantityRequired: 12, isConsumable: true },
      { name: 'Precision Metal Film Resistors Assortment (1k, 10k, 22k, 56k, 120k, 270k, 470k)', quantityRequired: 16, isConsumable: true },
      { name: 'Arbitrary Waveform / Function Generator', quantityRequired: 1, isConsumable: false },
      { name: 'Dual-Trace Analog Cathode Ray Oscilloscope (CRO)', quantityRequired: 1, isConsumable: false },
      { name: 'Triple-Output Precision DC Bench Power Supply', quantityRequired: 1, isConsumable: false },
      { name: 'Solderless Prototyping Breadboard', quantityRequired: 1, isConsumable: false },
      { name: 'LM741 General Purpose Op-Amp', quantityRequired: 1, isConsumable: true },
      { name: 'NE555 Precision Timer IC', quantityRequired: 1, isConsumable: true }
    ]
  },

  // -------------------------------------------------------------
  // EE3203 - Electrical and Electronic Measurements (Sem 3)
  // Location: Electronics and Measurements Laboratory
  // -------------------------------------------------------------
  {
    sessionId: 'SESS-EE3203-L1',
    courseCode: 'EE3203',
    courseName: 'Electrical and Electronic Measurements',
    semester: 3,
    labNumber: 1,
    title: 'Measurements using DC and AC Bridges',
    labName: 'Electronics and Measurements Laboratory',
    worktable: 'Worktable 6',
    scheduledDaysOffset: 2,
    timeSlot: '09:00 - 12:00',
    requiredEquipment: [
      { name: 'Wheatstone Bridge Measurement Apparatus', quantityRequired: 1, isConsumable: false },
      { name: 'Schering & Maxwell AC Bridge Training Apparatus', quantityRequired: 1, isConsumable: false },
      { name: 'High-Sensitivity Moving Coil Galvanometer', quantityRequired: 1, isConsumable: false },
      { name: 'Triple-Output Precision DC Bench Power Supply', quantityRequired: 1, isConsumable: false },
      { name: 'Arbitrary Waveform / Function Generator', quantityRequired: 1, isConsumable: false },
      { name: 'Decade Resistance Box (0.1Ω to 11.11MΩ)', quantityRequired: 1, isConsumable: false },
      { name: 'Decade Capacitance Box (100pF to 11.11µF)', quantityRequired: 1, isConsumable: false },
      { name: 'Decade Inductance Box (1mH to 11.11H)', quantityRequired: 1, isConsumable: false }
    ]
  },
  {
    sessionId: 'SESS-EE3203-L2',
    courseCode: 'EE3203',
    courseName: 'Electrical and Electronic Measurements',
    semester: 3,
    labNumber: 2,
    title: 'Oscilloscope Probe Testing and Calibration',
    labName: 'Electronics and Measurements Laboratory',
    worktable: 'Worktable 7',
    scheduledDaysOffset: 6,
    timeSlot: '13:00 - 16:00',
    requiredEquipment: [
      { name: 'Feedback 20 MHz Dual-Trace Analog Oscilloscope', quantityRequired: 1, isConsumable: false },
      { name: 'KENWOOD PC-54 Oscilloscope Probe Set with Trimmer', quantityRequired: 2, isConsumable: false },
      { name: 'Arbitrary Waveform / Function Generator', quantityRequired: 1, isConsumable: false },
      { name: 'BNC to Alligator Clip Test Leads Set', quantityRequired: 2, isConsumable: false },
      { name: 'Precision Metal Film Resistor 47 kΩ', quantityRequired: 2, isConsumable: true },
      { name: 'Non-magnetic anti-static trimming adjustment tool', quantityRequired: 1, isConsumable: false }
    ]
  },
  {
    sessionId: 'SESS-EE3203-L3',
    courseCode: 'EE3203',
    courseName: 'Electrical and Electronic Measurements',
    semester: 3,
    labNumber: 3,
    title: 'Measurements using Spectrum Analyzer',
    labName: 'Electronics and Measurements Laboratory',
    worktable: 'Worktable 8',
    scheduledDaysOffset: 9,
    timeSlot: '09:00 - 12:00',
    requiredEquipment: [
      { name: 'RF Spectrum Analyzer', quantityRequired: 1, isConsumable: false },
      { name: 'Digital Storage Oscilloscope with Waveform Recorder', quantityRequired: 1, isConsumable: false },
      { name: 'Arbitrary Waveform / Function Generator', quantityRequired: 1, isConsumable: false },
      { name: 'RF Coaxial SMA to BNC Patch Cables', quantityRequired: 2, isConsumable: false }
    ]
  },

  // -------------------------------------------------------------
  // EE3306 - Signals and Systems (Sem 3)
  // Location: Communication and Systems Laboratory
  // -------------------------------------------------------------
  {
    sessionId: 'SESS-EE3306-L1',
    courseCode: 'EE3306',
    courseName: 'Signals and Systems',
    semester: 3,
    labNumber: 1,
    title: 'Analog to Digital Conversion and Sampling Theorem',
    labName: 'Communication and Systems Laboratory',
    worktable: 'Worktable 6',
    scheduledDaysOffset: 3,
    timeSlot: '09:00 - 12:00',
    requiredEquipment: [
      { name: 'Digital Storage Oscilloscope with Waveform Recorder', quantityRequired: 1, isConsumable: false },
      { name: 'Triple-Output Precision DC Bench Power Supply', quantityRequired: 1, isConsumable: false },
      { name: 'LM741 General Purpose Op-Amp', quantityRequired: 2, isConsumable: true },
      { name: 'A/D & D/A Conversion with PCM Encoding Trainer Unit', quantityRequired: 1, isConsumable: false },
      { name: 'Precision R-2R Resistor Ladder Set (1kΩ, 1.5kΩ, 2kΩ, 4kΩ)', quantityRequired: 8, isConsumable: true },
      { name: 'Solderless Prototyping Breadboard', quantityRequired: 1, isConsumable: false }
    ]
  },

  // -------------------------------------------------------------
  // EE4306 - Engineering Electromagnetics (Sem 4)
  // Location: Communication and Systems Laboratory
  // -------------------------------------------------------------
  {
    sessionId: 'SESS-EE4306-L1',
    courseCode: 'EE4306',
    courseName: 'Engineering Electromagnetics',
    semester: 4,
    labNumber: 1,
    title: 'Study of Basic Electromagnetics Principles and Magnetic Circuits',
    labName: 'Communication and Systems Laboratory',
    worktable: 'Worktable 2',
    scheduledDaysOffset: 5,
    timeSlot: '09:00 - 12:00',
    requiredEquipment: [
      { name: 'Electromagnetics Induction Test Ring Apparatus', quantityRequired: 1, isConsumable: false },
      { name: 'Electromagnetic Solenoid Test Coil & Ring Set', quantityRequired: 1, isConsumable: false },
      { name: 'Fixed & Movable Conductor Demonstration Rail Kit', quantityRequired: 1, isConsumable: false },
      { name: 'Alnico Oblong Permanent Bar Magnet Pair', quantityRequired: 1, isConsumable: false },
      { name: 'Magnetic Flat Form Ring (Permalloy Core)', quantityRequired: 1, isConsumable: false },
      { name: 'Magnetic Field Plotting Compasses (Set of 2)', quantityRequired: 2, isConsumable: false },
      { name: 'Dual Coupled Helmholtz Induction Coils', quantityRequired: 1, isConsumable: false },
      { name: 'Steel Rod & Ferrite Rod Core Set', quantityRequired: 1, isConsumable: false },
      { name: 'Hall Effect Digital Gaussmeter / Teslameter', quantityRequired: 1, isConsumable: false },
      { name: 'True RMS Industrial Handheld Multimeter', quantityRequired: 1, isConsumable: false }
    ]
  },
  {
    sessionId: 'SESS-EE4306-L2',
    courseCode: 'EE4306',
    courseName: 'Engineering Electromagnetics',
    semester: 4,
    labNumber: 2,
    title: 'Study on Antenna Types and Radiation Beam Patterns',
    labName: 'Communication and Systems Laboratory',
    worktable: 'Worktable 8',
    scheduledDaysOffset: 12,
    timeSlot: '13:00 - 16:00',
    requiredEquipment: [
      { name: 'Motorized Antenna Radiation Pattern Trainer', quantityRequired: 1, isConsumable: false },
      { name: 'Vector Network Analyzer (VNA)', quantityRequired: 1, isConsumable: false },
      { name: 'MATLAB Antenna & RF Simulation Workstation', quantityRequired: 1, isConsumable: false },
      { name: 'Microwave X-Band Test Bench (8-12 GHz)', quantityRequired: 1, isConsumable: false }
    ]
  },

  // -------------------------------------------------------------
  // EE4301 - Communication System 1 (Sem 4)
  // Location: Communication and Systems Laboratory
  // -------------------------------------------------------------
  {
    sessionId: 'SESS-EE4301-L1',
    courseCode: 'EE4301',
    courseName: 'Communication System 1',
    semester: 4,
    labNumber: 1,
    title: 'Amplitude Modulation and Demodulation (AM)',
    labName: 'Communication and Systems Laboratory',
    worktable: 'Worktable 3',
    scheduledDaysOffset: 7,
    timeSlot: '09:00 - 12:00',
    requiredEquipment: [
      { name: 'AM Modulation & Demodulation Laboratory Board', quantityRequired: 1, isConsumable: false },
      { name: 'Arbitrary Waveform / Function Generator', quantityRequired: 1, isConsumable: false },
      { name: 'High-Frequency Oscilloscope (>500 MHz)', quantityRequired: 1, isConsumable: false },
      { name: 'RF Spectrum Analyzer', quantityRequired: 1, isConsumable: false },
      { name: 'True RMS Industrial Handheld Multimeter', quantityRequired: 1, isConsumable: false },
      { name: 'BNC to BNC Coaxial Connecting Leads (Set of 4)', quantityRequired: 1, isConsumable: false }
    ]
  },
  {
    sessionId: 'SESS-EE4301-L2',
    courseCode: 'EE4301',
    courseName: 'Communication System 1',
    semester: 4,
    labNumber: 2,
    title: 'Frequency Modulation (FM) and Phase-Locked Loop Detection',
    labName: 'Communication and Systems Laboratory',
    worktable: 'Worktable 4',
    scheduledDaysOffset: 10,
    timeSlot: '13:00 - 16:00',
    requiredEquipment: [
      { name: 'FM Modulation & Demodulation Laboratory Board', quantityRequired: 1, isConsumable: false },
      { name: 'Arbitrary Waveform / Function Generator', quantityRequired: 1, isConsumable: false },
      { name: 'High-Frequency Oscilloscope (>500 MHz)', quantityRequired: 1, isConsumable: false },
      { name: 'RF Spectrum Analyzer', quantityRequired: 1, isConsumable: false },
      { name: 'BNC to BNC Coaxial Connecting Leads (Set of 4)', quantityRequired: 1, isConsumable: false }
    ]
  },
  {
    sessionId: 'SESS-EE4301-L3',
    courseCode: 'EE4301',
    courseName: 'Communication System 1',
    semester: 4,
    labNumber: 3,
    title: 'Digital Carrier Wave Modulation (ASK, FSK, PSK)',
    labName: 'Communication and Systems Laboratory',
    worktable: 'Worktable 5',
    scheduledDaysOffset: 13,
    timeSlot: '09:00 - 12:00',
    requiredEquipment: [
      { name: 'Digital Carrier Modulation Trainer (ASK, FSK, PSK)', quantityRequired: 1, isConsumable: false },
      { name: 'Digital Storage Oscilloscope with Waveform Recorder', quantityRequired: 1, isConsumable: false },
      { name: 'Arbitrary Waveform / Function Generator', quantityRequired: 1, isConsumable: false }
    ]
  },
  {
    sessionId: 'SESS-EE4301-L4',
    courseCode: 'EE4301',
    courseName: 'Communication System 1',
    semester: 4,
    labNumber: 4,
    title: 'Pulse Code Modulation (PCM) and TDM Multiplexing',
    labName: 'Communication and Systems Laboratory',
    worktable: 'Worktable 7',
    scheduledDaysOffset: 15,
    timeSlot: '13:00 - 16:00',
    requiredEquipment: [
      { name: 'Pulse Code Modulation (PCM) Codec Trainer Board', quantityRequired: 1, isConsumable: false },
      { name: 'Digital Storage Oscilloscope with Waveform Recorder', quantityRequired: 1, isConsumable: false },
      { name: 'Bit Error Rate (BER) Tester', quantityRequired: 1, isConsumable: false }
    ]
  },

  // -------------------------------------------------------------
  // EE4304 - Digital Logic Design (Sem 4)
  // Location: Electronics and Measurements Laboratory
  // -------------------------------------------------------------
  {
    sessionId: 'SESS-EE4304-L1',
    courseCode: 'EE4304',
    courseName: 'Digital Logic Design',
    semester: 4,
    labNumber: 1,
    title: 'Design of a Combinational Logic Circuit and Display Decoder',
    labName: 'Electronics and Measurements Laboratory',
    worktable: 'Worktable 8',
    scheduledDaysOffset: 7,
    timeSlot: '13:00 - 16:00',
    requiredEquipment: [
      { name: '74151 8-to-1 Multiplexer / Data Selector IC', quantityRequired: 1, isConsumable: true },
      { name: '7447 BCD to 7-Segment Decoder / Driver IC', quantityRequired: 1, isConsumable: true },
      { name: '7-Segment LED Display (0.56-inch Common Cathode)', quantityRequired: 1, isConsumable: true },
      { name: 'Basic Logic Gates Assortment (7404 NOT, 7411 Triple 3-Input AND)', quantityRequired: 4, isConsumable: true },
      { name: 'Solderless Prototyping Breadboard', quantityRequired: 1, isConsumable: false },
      { name: 'Triple-Output Precision DC Bench Power Supply', quantityRequired: 1, isConsumable: false },
      { name: 'Assorted Pre-cut Jumper Wire Kits', quantityRequired: 1, isConsumable: false }
    ]
  },
  {
    sessionId: 'SESS-EE4304-L2',
    courseCode: 'EE4304',
    courseName: 'Digital Logic Design',
    semester: 4,
    labNumber: 2,
    title: 'Design of a Synchronous Sequential Logic Circuit and State Machine',
    labName: 'Electronics and Measurements Laboratory',
    worktable: 'Worktable 9',
    scheduledDaysOffset: 10,
    timeSlot: '09:00 - 12:00',
    requiredEquipment: [
      { name: 'DM7474 Dual Positive-Edge-Triggered D-Type Flip-Flop IC', quantityRequired: 2, isConsumable: true },
      { name: '74LS00 Quad 2-Input NAND Gate IC', quantityRequired: 2, isConsumable: true },
      { name: 'Basic Logic Gates Assortment (7404 NOT, 7411 Triple 3-Input AND)', quantityRequired: 2, isConsumable: true },
      { name: 'Solderless Prototyping Breadboard', quantityRequired: 1, isConsumable: false },
      { name: 'Triple-Output Precision DC Bench Power Supply', quantityRequired: 1, isConsumable: false },
      { name: 'Digital Storage Oscilloscope with Waveform Recorder', quantityRequired: 1, isConsumable: false }
    ]
  },
  {
    sessionId: 'SESS-EE4304-L3',
    courseCode: 'EE4304',
    courseName: 'Digital Logic Design',
    semester: 4,
    labNumber: 3,
    title: 'Characteristics of Different Logic Families (TTL vs. CMOS)',
    labName: 'Electronics and Measurements Laboratory',
    worktable: 'Worktable 10',
    scheduledDaysOffset: 14,
    timeSlot: '13:00 - 16:00',
    requiredEquipment: [
      { name: 'CD4001 CMOS Quad 2-Input NOR Gate IC', quantityRequired: 1, isConsumable: true },
      { name: '74LS00 Quad 2-Input NAND Gate IC', quantityRequired: 1, isConsumable: true },
      { name: 'Digital Storage Oscilloscope with Waveform Recorder', quantityRequired: 1, isConsumable: false },
      { name: 'Arbitrary Waveform / Function Generator', quantityRequired: 1, isConsumable: false },
      { name: 'Basic Logic Gates Assortment (7404 NOT, 7411 Triple 3-Input AND)', quantityRequired: 2, isConsumable: true },
      { name: 'Solderless Prototyping Breadboard', quantityRequired: 1, isConsumable: false }
    ]
  },

  // -------------------------------------------------------------
  // EE4302 - Electric Machines I (Sem 4)
  // Location: Electric Machines and Power Systems Laboratory
  // -------------------------------------------------------------
  {
    sessionId: 'SESS-EE4302-L1',
    courseCode: 'EE4302',
    courseName: 'Electric Machines I',
    semester: 4,
    labNumber: 1,
    title: 'Output Characteristics and Speed Regulation of DC Machines',
    labName: 'Electric Machines and Power Systems Laboratory',
    worktable: 'Worktable 1',
    scheduledDaysOffset: 4,
    timeSlot: '09:00 - 12:00',
    requiredEquipment: [
      { name: 'SM2641 Separately Excited / Shunt DC Machine', quantityRequired: 1, isConsumable: false },
      { name: 'Eddy Current Brake Dynamometer', quantityRequired: 1, isConsumable: false },
      { name: 'MV1052 Digital Torque & Speed Measuring Unit', quantityRequired: 1, isConsumable: false },
      { name: 'SM2631 Regulated Variable DC / AC Power Supply Unit', quantityRequired: 1, isConsumable: false },
      { name: 'SM2676 Switched Load Resistor Bank (3-Phase)', quantityRequired: 1, isConsumable: false },
      { name: 'SM2635 Safety Terminal Connection Board', quantityRequired: 1, isConsumable: false },
      { name: 'Benchtop Precision DC Voltmeter (0-100V Analog)', quantityRequired: 1, isConsumable: false },
      { name: 'Benchtop Precision DC Ammeter (0-1A / 0-10A Analog)', quantityRequired: 1, isConsumable: false }
    ]
  },
  {
    sessionId: 'SESS-EE4302-L2',
    courseCode: 'EE4302',
    courseName: 'Electric Machines I',
    semester: 4,
    labNumber: 2,
    title: 'Synchronous Generator Model Parameters and Saturation Curves',
    labName: 'Electric Machines and Power Systems Laboratory',
    worktable: 'Worktable 2',
    scheduledDaysOffset: 8,
    timeSlot: '13:00 - 16:00',
    requiredEquipment: [
      { name: 'SM2645 3-Phase Synchronous AC Machine', quantityRequired: 1, isConsumable: false },
      { name: 'SM2641 Separately Excited / Shunt DC Machine', quantityRequired: 1, isConsumable: false },
      { name: 'MV1052 Digital Torque & Speed Measuring Unit', quantityRequired: 1, isConsumable: false },
      { name: 'SM2631 Regulated Variable DC / AC Power Supply Unit', quantityRequired: 1, isConsumable: false },
      { name: 'SM2676 Switched Load Resistor Bank (3-Phase)', quantityRequired: 1, isConsumable: false },
      { name: 'SM2635 Safety Terminal Connection Board', quantityRequired: 1, isConsumable: false },
      { name: 'High-Current Rotary Load Selector Switch Panel', quantityRequired: 1, isConsumable: false },
      { name: 'Benchtop Precision AC Voltmeter (0-300V / 0-400V)', quantityRequired: 1, isConsumable: false },
      { name: 'Benchtop Precision AC Ammeter (0-1A / 0-10A Dual Range)', quantityRequired: 3, isConsumable: false },
      { name: 'Benchtop Precision DC Voltmeter (0-100V Analog)', quantityRequired: 1, isConsumable: false },
      { name: 'Benchtop Precision DC Ammeter (0-1A / 0-10A Analog)', quantityRequired: 1, isConsumable: false }
    ]
  },
  {
    sessionId: 'SESS-EE4302-L3',
    courseCode: 'EE4302',
    courseName: 'Electric Machines I',
    semester: 4,
    labNumber: 3,
    title: 'Study on Single Phase Transformer Equivalent Circuit Parameters',
    labName: 'Electric Machines and Power Systems Laboratory',
    worktable: 'Worktable 4',
    scheduledDaysOffset: 12,
    timeSlot: '09:00 - 12:00',
    requiredEquipment: [
      { name: 'Single Phase Testing Transformer 230V/115V 1.0 kVA (50Hz)', quantityRequired: 1, isConsumable: false },
      { name: 'Variable Auto-Transformer (Variac 0-260V 8A 2.08kVA)', quantityRequired: 1, isConsumable: false },
      { name: 'Analog Dynamometer Wattmeter', quantityRequired: 1, isConsumable: false },
      { name: 'Digital Power Factor Meter (0.2 Lag to 0.2 Lead)', quantityRequired: 1, isConsumable: false },
      { name: 'Benchtop Precision AC Voltmeter (0-300V / 0-400V)', quantityRequired: 1, isConsumable: false },
      { name: 'Benchtop Precision AC Ammeter (0-1A / 0-10A Dual Range)', quantityRequired: 1, isConsumable: false },
      { name: '3-Phase Variable Resistive Load Bank (5kW)', quantityRequired: 1, isConsumable: false },
      { name: '3-Phase Variable Inductive Load Bank (3kVAR)', quantityRequired: 1, isConsumable: false },
      { name: '3-Phase Variable Capacitive Load Bank (3kVAR)', quantityRequired: 1, isConsumable: false }
    ]
  }
];

module.exports = practicalCurriculum;
