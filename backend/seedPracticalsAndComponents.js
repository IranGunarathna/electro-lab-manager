// backend/seedPracticalsAndComponents.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Component = require('./models/Component');
const LabSession = require('./models/LabSession');
const User = require('./models/User');

dotenv.config();

const newComponents = [
  // ==========================================
  // Electronics and Measurements Laboratory
  // ==========================================
  {
    compId: 'EML-XFMR-01',
    name: '230V / 6V Step-Down Center-Tapped Transformer',
    spec: '230V to 6V-0-6V 1A Mains Step-Down Transformer',
    category: 'Equipment',
    lab: 'Electronics and Measurements Laboratory',
    location: 'Worktable 2',
    shelfLoc: 'Worktable 2',
    totalQuantity: 12,
    stockQty: 12,
    availableQuantity: 12,
    usageType: 'Lab-Reference Only',
    maxLoanDurationDays: 1,
    status: 'Available',
    description: 'Low-voltage isolation and rectifier transformer for analog power supply experiments.'
  },
  {
    compId: 'EML-TR-BC108',
    name: 'BC108 NPN Silicon Bipolar Transistor',
    spec: 'TO-18 Metal Can Package, Vceo=20V, Ic=100mA, hFE=110-800',
    category: 'Active Component',
    lab: 'Electronics and Measurements Laboratory',
    location: 'Worktable 3',
    shelfLoc: 'Worktable 3',
    totalQuantity: 120,
    stockQty: 120,
    availableQuantity: 120,
    usageType: 'Consumable',
    maxLoanDurationDays: 0,
    status: 'Available',
    description: 'Low-noise audio frequency general purpose transistor for amplifier and oscillator labs.'
  },
  {
    compId: 'EML-MTR-UA',
    name: 'Analog DC Micro-Ammeter (0-100 µA)',
    spec: 'Bench Moving-Coil Micro-Ammeter (Class 1.5, Mirrored Scale)',
    category: 'Equipment',
    lab: 'Electronics and Measurements Laboratory',
    location: 'Worktable 4',
    shelfLoc: 'Worktable 4',
    totalQuantity: 10,
    stockQty: 10,
    availableQuantity: 10,
    usageType: 'Lab-Reference Only',
    maxLoanDurationDays: 1,
    status: 'Available',
    description: 'Sensitive analog meter for measuring transistor base currents and leakage currents.'
  },
  {
    compId: 'EML-MTR-MA',
    name: 'Analog DC Milli-Ammeter (0-100 mA)',
    spec: 'Bench Moving-Coil Milli-Ammeter (Class 1.5, Mirrored Scale)',
    category: 'Equipment',
    lab: 'Electronics and Measurements Laboratory',
    location: 'Worktable 4',
    shelfLoc: 'Worktable 4',
    totalQuantity: 10,
    stockQty: 10,
    availableQuantity: 10,
    usageType: 'Lab-Reference Only',
    maxLoanDurationDays: 1,
    status: 'Available',
    description: 'Analog bench meter for transistor collector biasing and diode forward current tests.'
  },
  {
    compId: 'EML-POT-1M',
    name: 'Rotary Carbon Potentiometer 1 MΩ (Linear)',
    spec: '1MΩ Single-Turn Carbon Track Potentiometer with Breadboard Pins',
    category: 'Passive Component',
    lab: 'Electronics and Measurements Laboratory',
    location: 'Worktable 1',
    shelfLoc: 'Worktable 1',
    totalQuantity: 40,
    stockQty: 40,
    availableQuantity: 40,
    usageType: 'Takeaway Borrowable',
    maxLoanDurationDays: 3,
    status: 'Available',
    description: 'High-resistance trimmer and variable control for amplifier biasing networks.'
  },
  {
    compId: 'EML-POT-200K',
    name: 'Rotary Carbon Potentiometer 200 kΩ (Linear)',
    spec: '200kΩ Linear Single-Turn Potentiometer',
    category: 'Passive Component',
    lab: 'Electronics and Measurements Laboratory',
    location: 'Worktable 1',
    shelfLoc: 'Worktable 1',
    totalQuantity: 40,
    stockQty: 40,
    availableQuantity: 40,
    usageType: 'Takeaway Borrowable',
    maxLoanDurationDays: 3,
    status: 'Available',
    description: 'Precision variable resistor for feedback tuning in filter and oscillator circuits.'
  },
  {
    compId: 'EML-IND-40U',
    name: 'RF Choke Inductor 40 µH',
    spec: '40µH Axial Leaded Fixed RF Choke, 500mA rating',
    category: 'Passive Component',
    lab: 'Electronics and Measurements Laboratory',
    location: 'Worktable 5',
    shelfLoc: 'Worktable 5',
    totalQuantity: 60,
    stockQty: 60,
    availableQuantity: 60,
    usageType: 'Consumable',
    maxLoanDurationDays: 0,
    status: 'Available',
    description: 'Fixed high-Q inductor for Colpitts and Hartley LC tank resonant circuits.'
  },
  {
    compId: 'EML-IND-5U5',
    name: 'RF Choke Inductor 5.5 µH',
    spec: '5.5µH High-Q Molded Axial Inductor, 600mA rating',
    category: 'Passive Component',
    lab: 'Electronics and Measurements Laboratory',
    location: 'Worktable 5',
    shelfLoc: 'Worktable 5',
    totalQuantity: 60,
    stockQty: 60,
    availableQuantity: 60,
    usageType: 'Consumable',
    maxLoanDurationDays: 0,
    status: 'Available',
    description: 'Molded RF inductor used in high-frequency band-pass filtering and oscillators.'
  },
  {
    compId: 'EML-CAP-ASSORT',
    name: 'Precision Film & Ceramic Capacitor Kit (0.001µF to 2.2µF)',
    spec: 'Includes 1000pF, 0.001µF, 0.002µF, 10nF, 0.1µF, 0.33µF, 2.2µF',
    category: 'Passive Component',
    lab: 'Electronics and Measurements Laboratory',
    location: 'Worktable 6',
    shelfLoc: 'Worktable 6',
    totalQuantity: 150,
    stockQty: 150,
    availableQuantity: 150,
    usageType: 'Consumable',
    maxLoanDurationDays: 0,
    status: 'Available',
    description: 'Comprehensive capacitor assortment pack for active filter and analog oscillator tuning.'
  },
  {
    compId: 'EML-OSC-F20',
    name: 'Feedback 20 MHz Dual-Trace Analog Oscilloscope',
    spec: 'Feedback Instruments 20MHz Dual-Channel Analog CRT Oscilloscope',
    category: 'Equipment',
    lab: 'Electronics and Measurements Laboratory',
    location: 'Worktable 7',
    shelfLoc: 'Worktable 7',
    totalQuantity: 10,
    stockQty: 10,
    availableQuantity: 10,
    usageType: 'Lab-Reference Only',
    maxLoanDurationDays: 1,
    status: 'Available',
    description: 'Dedicated oscilloscope station for probe compensation and analog signal measurement.'
  },
  {
    compId: 'EML-PRB-PC54',
    name: 'KENWOOD PC-54 Oscilloscope Probe Set with Trimmer',
    spec: '1x / 10x Switchable 100MHz Attenuator Probe with Plastic Calibration Screwdriver',
    category: 'Tool',
    lab: 'Electronics and Measurements Laboratory',
    location: 'Worktable 7',
    shelfLoc: 'Worktable 7',
    totalQuantity: 16,
    stockQty: 16,
    availableQuantity: 16,
    usageType: 'Takeaway Borrowable',
    maxLoanDurationDays: 3,
    status: 'Available',
    description: 'High-impedance oscilloscope probe with HF compensation trimmer capacitor for calibration.'
  },
  {
    compId: 'EML-IC-74151',
    name: '74151 8-to-1 Multiplexer / Data Selector IC',
    spec: 'DIP-16 TTL 8-Channel Digital Multiplexer with Inverted & Non-Inverted Outputs',
    category: 'Active Component',
    lab: 'Electronics and Measurements Laboratory',
    location: 'Worktable 8',
    shelfLoc: 'Worktable 8',
    totalQuantity: 50,
    stockQty: 50,
    availableQuantity: 50,
    usageType: 'Consumable',
    maxLoanDurationDays: 0,
    status: 'Available',
    description: 'Digital logic IC for combinational logic realization and Boolean function generator.'
  },
  {
    compId: 'EML-IC-7447',
    name: '7447 BCD to 7-Segment Decoder / Driver IC',
    spec: 'DIP-16 Active-Low Open-Collector High-Current Display Driver',
    category: 'Active Component',
    lab: 'Electronics and Measurements Laboratory',
    location: 'Worktable 8',
    shelfLoc: 'Worktable 8',
    totalQuantity: 50,
    stockQty: 50,
    availableQuantity: 50,
    usageType: 'Consumable',
    maxLoanDurationDays: 0,
    status: 'Available',
    description: 'Decodes 4-bit Binary Coded Decimal input to drive numerical 7-segment LED displays.'
  },
  {
    compId: 'EML-DISP-7SEG',
    name: '7-Segment LED Display (0.56-inch Common Cathode)',
    spec: '10-Pin Red Common Cathode Single Digit 7-Segment LED Display',
    category: 'Passive Component',
    lab: 'Electronics and Measurements Laboratory',
    location: 'Worktable 8',
    shelfLoc: 'Worktable 8',
    totalQuantity: 80,
    stockQty: 80,
    availableQuantity: 80,
    usageType: 'Consumable',
    maxLoanDurationDays: 0,
    status: 'Available',
    description: 'Numerical LED readout module for digital counters and logic circuit demonstrations.'
  },
  {
    compId: 'EML-IC-7474',
    name: 'DM7474 Dual Positive-Edge-Triggered D-Type Flip-Flop IC',
    spec: 'DIP-14 TTL Dual D Flip-Flop with Individual Preset and Clear Inputs',
    category: 'Active Component',
    lab: 'Electronics and Measurements Laboratory',
    location: 'Worktable 9',
    shelfLoc: 'Worktable 9',
    totalQuantity: 60,
    stockQty: 60,
    availableQuantity: 60,
    usageType: 'Consumable',
    maxLoanDurationDays: 0,
    status: 'Available',
    description: 'Sequential logic IC for state machine design, shift registers, and synchronous counters.'
  },
  {
    compId: 'EML-IC-4001',
    name: 'CD4001 CMOS Quad 2-Input NOR Gate IC',
    spec: 'DIP-14 CMOS Buffered Quad 2-Input NOR Logic Gates (3V-15V Operating Range)',
    category: 'Active Component',
    lab: 'Electronics and Measurements Laboratory',
    location: 'Worktable 9',
    shelfLoc: 'Worktable 9',
    totalQuantity: 60,
    stockQty: 60,
    availableQuantity: 60,
    usageType: 'Consumable',
    maxLoanDurationDays: 0,
    status: 'Available',
    description: 'CMOS family digital logic IC for comparing propagation delay and power dissipation against TTL.'
  },
  {
    compId: 'EML-IC-74LS00',
    name: '74LS00 Quad 2-Input NAND Gate IC',
    spec: 'DIP-14 Low-Power Schottky TTL Quad 2-Input NAND Logic Gate',
    category: 'Active Component',
    lab: 'Electronics and Measurements Laboratory',
    location: 'Worktable 9',
    shelfLoc: 'Worktable 9',
    totalQuantity: 80,
    stockQty: 80,
    availableQuantity: 80,
    usageType: 'Consumable',
    maxLoanDurationDays: 0,
    status: 'Available',
    description: 'Universal TTL logic IC for digital gate characteristics and logic synthesis experiments.'
  },
  {
    compId: 'EML-IC-GATES',
    name: 'Basic Logic Gates Assortment (7404 NOT, 7411 Triple 3-Input AND)',
    spec: 'DIP-14 Assorted Standard TTL Logic Gates Pack',
    category: 'Active Component',
    lab: 'Electronics and Measurements Laboratory',
    location: 'Worktable 9',
    shelfLoc: 'Worktable 9',
    totalQuantity: 70,
    stockQty: 70,
    availableQuantity: 70,
    usageType: 'Consumable',
    maxLoanDurationDays: 0,
    status: 'Available',
    description: 'Complementary gate logic kit for digital logic lab combinational designs.'
  },

  // ==========================================
  // Communication and Systems Laboratory
  // ==========================================
  {
    compId: 'CSL-EM-RING',
    name: 'Electromagnetics Induction Test Ring Apparatus',
    spec: 'Solid Copper & Aluminum Eddy Current Rings with Low-Friction Center Pivot Stand',
    category: 'Equipment',
    lab: 'Communication and Systems Laboratory',
    location: 'Worktable 2',
    shelfLoc: 'Worktable 2',
    totalQuantity: 8,
    stockQty: 8,
    availableQuantity: 8,
    usageType: 'Lab-Reference Only',
    maxLoanDurationDays: 1,
    status: 'Available',
    description: 'Demonstrates Lenz law, magnetic induction repulsion, and eddy current damping.'
  },
  {
    compId: 'CSL-EM-SOLENOID',
    name: 'Electromagnetic Solenoid Test Coil & Ring Set',
    spec: 'Calibrated Multi-Turn Acrylic-Core Solenoid with Movable Search Pick-Up Ring',
    category: 'Equipment',
    lab: 'Communication and Systems Laboratory',
    location: 'Worktable 2',
    shelfLoc: 'Worktable 2',
    totalQuantity: 8,
    stockQty: 8,
    availableQuantity: 8,
    usageType: 'Lab-Reference Only',
    maxLoanDurationDays: 1,
    status: 'Available',
    description: 'Investigates axial magnetic field distributions, Ampere law, and coil mutual inductance.'
  },
  {
    compId: 'CSL-EM-RAIL',
    name: 'Fixed & Movable Conductor Demonstration Rail Kit',
    spec: 'Precision Parallel Brass Rails with Low-Friction Rolling Conductor Crossbar',
    category: 'Equipment',
    lab: 'Communication and Systems Laboratory',
    location: 'Worktable 3',
    shelfLoc: 'Worktable 3',
    totalQuantity: 6,
    stockQty: 6,
    availableQuantity: 6,
    usageType: 'Lab-Reference Only',
    maxLoanDurationDays: 1,
    status: 'Available',
    description: 'Demonstrates Lorentz force (F = I L x B) and motional electromagnetic induction.'
  },
  {
    compId: 'CSL-EM-MAGNET',
    name: 'Alnico Oblong Permanent Bar Magnet Pair',
    spec: 'Grade 5 Alnico Magnetic Bar Pair with Clearly Marked North & South Poles (100mm)',
    category: 'Tool',
    lab: 'Communication and Systems Laboratory',
    location: 'Worktable 3',
    shelfLoc: 'Worktable 3',
    totalQuantity: 16,
    stockQty: 16,
    availableQuantity: 16,
    usageType: 'Takeaway Borrowable',
    maxLoanDurationDays: 3,
    status: 'Available',
    description: 'Stable permanent magnets for magnetic line plotting and field mapping experiments.'
  },
  {
    compId: 'CSL-EM-FLATRING',
    name: 'Magnetic Flat Form Ring (Permalloy Core)',
    spec: 'Soft High-Permeability Toroidal Magnetic Ring for Closed-Loop Magnetic Flux Studies',
    category: 'Equipment',
    lab: 'Communication and Systems Laboratory',
    location: 'Worktable 4',
    shelfLoc: 'Worktable 4',
    totalQuantity: 8,
    stockQty: 8,
    availableQuantity: 8,
    usageType: 'Lab-Reference Only',
    maxLoanDurationDays: 1,
    status: 'Available',
    description: 'Used for studying toroid magnetic reluctance, Hopkinson law, and flux leakage.'
  },
  {
    compId: 'CSL-EM-COMPASS',
    name: 'Magnetic Field Plotting Compasses (Set of 2)',
    spec: '20mm Transparent Liquid-Damped Compasses with Agate Bearings',
    category: 'Tool',
    lab: 'Communication and Systems Laboratory',
    location: 'Worktable 4',
    shelfLoc: 'Worktable 4',
    totalQuantity: 24,
    stockQty: 24,
    availableQuantity: 24,
    usageType: 'Takeaway Borrowable',
    maxLoanDurationDays: 3,
    status: 'Available',
    description: 'Precision magnetic compasses for tracing field lines around solenoids and conductors.'
  },
  {
    compId: 'CSL-EM-RODS',
    name: 'Steel Rod & Ferrite Rod Core Set',
    spec: 'Pair of Ø10mm x 150mm Cylindrical Rods (Mild Steel Core & High-Permeability Ferrite Rod)',
    category: 'Tool',
    lab: 'Communication and Systems Laboratory',
    location: 'Worktable 5',
    shelfLoc: 'Worktable 5',
    totalQuantity: 12,
    stockQty: 12,
    availableQuantity: 12,
    usageType: 'Takeaway Borrowable',
    maxLoanDurationDays: 3,
    status: 'Available',
    description: 'Demonstrates relative permeability enhancements and core saturation inside test coils.'
  },
  {
    compId: 'CSL-EM-COILPAIR',
    name: 'Dual Coupled Helmholtz Induction Coils',
    spec: 'Pair of Identical Coaxial Air-Core Induction Coils with Adjustable Spacing',
    category: 'Equipment',
    lab: 'Communication and Systems Laboratory',
    location: 'Worktable 5',
    shelfLoc: 'Worktable 5',
    totalQuantity: 6,
    stockQty: 6,
    availableQuantity: 6,
    usageType: 'Lab-Reference Only',
    maxLoanDurationDays: 1,
    status: 'Available',
    description: 'Generates uniform axial magnetic fields and investigates mutual magnetic coupling coefficient.'
  },
  {
    compId: 'CSL-COMM-AM',
    name: 'AM Modulation & Demodulation Laboratory Board',
    spec: 'Dual Sideband Suppressed/Transmitted Carrier Board with Diode Envelope Detector',
    category: 'Equipment',
    lab: 'Communication and Systems Laboratory',
    location: 'Worktable 6',
    shelfLoc: 'Worktable 6',
    totalQuantity: 10,
    stockQty: 10,
    availableQuantity: 10,
    usageType: 'Lab-Reference Only',
    maxLoanDurationDays: 1,
    status: 'Available',
    description: 'Modular circuit board investigating amplitude modulation index, trapezoid patterns, and detection.'
  },
  {
    compId: 'CSL-COMM-FM',
    name: 'FM Modulation & Demodulation Laboratory Board',
    spec: 'VCO Varactor Reactance Modulator & Phase-Locked Loop (PLL) Demodulator Board',
    category: 'Equipment',
    lab: 'Communication and Systems Laboratory',
    location: 'Worktable 6',
    shelfLoc: 'Worktable 6',
    totalQuantity: 10,
    stockQty: 10,
    availableQuantity: 10,
    usageType: 'Lab-Reference Only',
    maxLoanDurationDays: 1,
    status: 'Available',
    description: 'Laboratory board examining Carson rule bandwidth, frequency deviation, and discriminator linearity.'
  },
  {
    compId: 'CSL-COMM-DIG',
    name: 'Digital Carrier Modulation Trainer (ASK, FSK, PSK)',
    spec: 'Synchronous Binary Shift Keying Modulator and Costas Loop Demodulator Unit',
    category: 'Equipment',
    lab: 'Communication and Systems Laboratory',
    location: 'Worktable 7',
    shelfLoc: 'Worktable 7',
    totalQuantity: 8,
    stockQty: 8,
    availableQuantity: 8,
    usageType: 'Lab-Reference Only',
    maxLoanDurationDays: 1,
    status: 'Available',
    description: 'Generates and decodes digital passband modulated waveforms under noise conditions.'
  },
  {
    compId: 'CSL-COMM-PCM',
    name: 'Pulse Code Modulation (PCM) Codec Trainer Board',
    spec: 'Sampling & Hold, 8-Bit Uniform/Non-Uniform Quantizer and TDM Multiplexer Board',
    category: 'Equipment',
    lab: 'Communication and Systems Laboratory',
    location: 'Worktable 7',
    shelfLoc: 'Worktable 7',
    totalQuantity: 8,
    stockQty: 8,
    availableQuantity: 8,
    usageType: 'Lab-Reference Only',
    maxLoanDurationDays: 1,
    status: 'Available',
    description: 'Hardware codec demonstrating sampling rate criteria, quantization noise, and PCM reconstruction.'
  },
  {
    compId: 'CSL-MATLAB-STN',
    name: 'MATLAB Antenna & RF Simulation Workstation',
    spec: 'Dell Precision Workstation with MATLAB Antenna Toolbox, CST Microwave Studio & SDR Link',
    category: 'Equipment',
    lab: 'Communication and Systems Laboratory',
    location: 'Worktable 8',
    shelfLoc: 'Worktable 8',
    totalQuantity: 6,
    stockQty: 6,
    availableQuantity: 6,
    usageType: 'Lab-Reference Only',
    maxLoanDurationDays: 1,
    status: 'Available',
    description: 'Dedicated computer workstation for simulating 3D antenna radiation patterns, array factors, and gain.'
  },

  // ==========================================
  // Electric Machines and Power Systems Laboratory
  // ==========================================
  {
    compId: 'EMPS-SM2641',
    name: 'SM2641 Separately Excited / Shunt DC Machine',
    spec: 'Terco SM2641 1.5kW 220V 1500 RPM DC Machine with Interpoles and Compound Field',
    category: 'Equipment',
    lab: 'Electric Machines and Power Systems Laboratory',
    location: 'Worktable 1',
    shelfLoc: 'Worktable 1',
    totalQuantity: 4,
    stockQty: 4,
    availableQuantity: 4,
    usageType: 'Lab-Reference Only',
    maxLoanDurationDays: 1,
    status: 'Available',
    description: 'Bench machine set for plotting DC motor speed-torque and generator magnetization curves.'
  },
  {
    compId: 'EMPS-SM2645',
    name: 'SM2645 3-Phase Synchronous AC Machine',
    spec: 'Terco SM2645 1.5kVA 400V 4-Pole Salient-Pole Synchronous Generator with Damper Windings',
    category: 'Equipment',
    lab: 'Electric Machines and Power Systems Laboratory',
    location: 'Worktable 2',
    shelfLoc: 'Worktable 2',
    totalQuantity: 4,
    stockQty: 4,
    availableQuantity: 4,
    usageType: 'Lab-Reference Only',
    maxLoanDurationDays: 1,
    status: 'Available',
    description: 'Synchronous machine for determining direct-axis (Xd) and quadrature-axis (Xq) reactances.'
  },
  {
    compId: 'EMPS-MV1052',
    name: 'MV1052 Digital Torque & Speed Measuring Unit',
    spec: 'Terco MV1052 Optical Speed Sensor & Strain Gauge Torque Indicator (0-50 Nm, 0-3000 RPM)',
    category: 'Equipment',
    lab: 'Electric Machines and Power Systems Laboratory',
    location: 'Worktable 1',
    shelfLoc: 'Worktable 1',
    totalQuantity: 4,
    stockQty: 4,
    availableQuantity: 4,
    usageType: 'Lab-Reference Only',
    maxLoanDurationDays: 1,
    status: 'Available',
    description: 'Precision mechanical power instrumentation measuring shaft torque and rotational velocity.'
  },
  {
    compId: 'EMPS-SM2631',
    name: 'SM2631 Regulated Variable DC / AC Power Supply Unit',
    spec: 'Terco SM2631 0-250V DC (10A) and 0-400V 3-Phase AC (10A) Integrated Bench Supply',
    category: 'Equipment',
    lab: 'Electric Machines and Power Systems Laboratory',
    location: 'Worktable 2',
    shelfLoc: 'Worktable 2',
    totalQuantity: 4,
    stockQty: 4,
    availableQuantity: 4,
    usageType: 'Lab-Reference Only',
    maxLoanDurationDays: 1,
    status: 'Available',
    description: 'Stabilized benchtop supply with thermal overload trip and emergency contactor switches.'
  },
  {
    compId: 'EMPS-SM2635',
    name: 'SM2635 Safety Terminal Connection Board',
    spec: 'Terco SM2635 4mm Shrouded Safety Banana Patch Panel for Motor Interconnections',
    category: 'Equipment',
    lab: 'Electric Machines and Power Systems Laboratory',
    location: 'Worktable 3',
    shelfLoc: 'Worktable 3',
    totalQuantity: 6,
    stockQty: 6,
    availableQuantity: 6,
    usageType: 'Lab-Reference Only',
    maxLoanDurationDays: 1,
    status: 'Available',
    description: 'Heavy-current connection patch board routing armature, field, and measurement leads.'
  },
  {
    compId: 'EMPS-SM2676',
    name: 'SM2676 Switched Load Resistor Bank (3-Phase)',
    spec: 'Terco SM2676 3x 1.2kW Stepped Wirewound Resistor Load with Selector Toggle Switches',
    category: 'Equipment',
    lab: 'Electric Machines and Power Systems Laboratory',
    location: 'Worktable 3',
    shelfLoc: 'Worktable 3',
    totalQuantity: 4,
    stockQty: 4,
    availableQuantity: 4,
    usageType: 'Lab-Reference Only',
    maxLoanDurationDays: 1,
    status: 'Available',
    description: 'Adjustable resistive load bank for generator load tests and terminal voltage regulation.'
  },
  {
    compId: 'EMPS-XFMR-1PH',
    name: 'Single Phase Testing Transformer 230V/115V 1.0 kVA (50Hz)',
    spec: 'Core-Type Single-Phase Transformer with Multi-Tap Primary & Secondary Terminals',
    category: 'Equipment',
    lab: 'Electric Machines and Power Systems Laboratory',
    location: 'Worktable 4',
    shelfLoc: 'Worktable 4',
    totalQuantity: 6,
    stockQty: 6,
    availableQuantity: 6,
    usageType: 'Lab-Reference Only',
    maxLoanDurationDays: 1,
    status: 'Available',
    description: 'Dedicated testing transformer for open-circuit core loss and short-circuit impedance tests.'
  },
  {
    compId: 'EMPS-VARIAC-8A',
    name: 'Variable Auto-Transformer (Variac 0-260V 8A 2.08kVA)',
    spec: 'Toroidal Single-Phase Continuous Rotary Auto-Transformer with Carbon Roller Brush',
    category: 'Equipment',
    lab: 'Electric Machines and Power Systems Laboratory',
    location: 'Worktable 4',
    shelfLoc: 'Worktable 4',
    totalQuantity: 6,
    stockQty: 6,
    availableQuantity: 6,
    usageType: 'Lab-Reference Only',
    maxLoanDurationDays: 1,
    status: 'Available',
    description: 'Continuously adjustable voltage supply for transformer testing and motor starting.'
  },
  {
    compId: 'EMPS-MTR-ACV',
    name: 'Benchtop Precision AC Voltmeter (0-300V / 0-400V)',
    spec: 'Moving-Iron AC Voltmeter Class 0.5 with Knife-Edge Pointer & Mirrored Scale',
    category: 'Equipment',
    lab: 'Electric Machines and Power Systems Laboratory',
    location: 'Worktable 5',
    shelfLoc: 'Worktable 5',
    totalQuantity: 10,
    stockQty: 10,
    availableQuantity: 10,
    usageType: 'Lab-Reference Only',
    maxLoanDurationDays: 1,
    status: 'Available',
    description: 'High-accuracy analog AC voltmeter for machines and transformer regulation studies.'
  },
  {
    compId: 'EMPS-MTR-ACA',
    name: 'Benchtop Precision AC Ammeter (0-1A / 0-10A Dual Range)',
    spec: 'Moving-Iron Dual-Range AC Ammeter Class 0.5 with Internal Shunts',
    category: 'Equipment',
    lab: 'Electric Machines and Power Systems Laboratory',
    location: 'Worktable 5',
    shelfLoc: 'Worktable 5',
    totalQuantity: 10,
    stockQty: 10,
    availableQuantity: 10,
    usageType: 'Lab-Reference Only',
    maxLoanDurationDays: 1,
    status: 'Available',
    description: 'Multi-range AC ammeter for measuring no-load excitation current and full-load currents.'
  },
  {
    compId: 'EMPS-MTR-DCV',
    name: 'Benchtop Precision DC Voltmeter (0-100V Analog)',
    spec: 'Permanent Magnet Moving-Coil (PMMC) DC Voltmeter Class 0.5',
    category: 'Equipment',
    lab: 'Electric Machines and Power Systems Laboratory',
    location: 'Worktable 6',
    shelfLoc: 'Worktable 6',
    totalQuantity: 8,
    stockQty: 8,
    availableQuantity: 8,
    usageType: 'Lab-Reference Only',
    maxLoanDurationDays: 1,
    status: 'Available',
    description: 'DC voltmeter for field excitation voltage and armature induced EMF measurement.'
  },
  {
    compId: 'EMPS-MTR-DCA',
    name: 'Benchtop Precision DC Ammeter (0-1A / 0-10A Analog)',
    spec: 'Permanent Magnet Moving-Coil (PMMC) DC Ammeter Class 0.5',
    category: 'Equipment',
    lab: 'Electric Machines and Power Systems Laboratory',
    location: 'Worktable 6',
    shelfLoc: 'Worktable 6',
    totalQuantity: 8,
    stockQty: 8,
    availableQuantity: 8,
    usageType: 'Lab-Reference Only',
    maxLoanDurationDays: 1,
    status: 'Available',
    description: 'DC ammeter for measuring machine field excitation currents and DC motor input.'
  },
  {
    compId: 'EMPS-LOAD-SW',
    name: 'High-Current Rotary Load Selector Switch Panel',
    spec: '3-Pole 32A 690V Enclosed Rotary Cam Load Switch with Auxiliary Contacts',
    category: 'Tool',
    lab: 'Electric Machines and Power Systems Laboratory',
    location: 'Worktable 3',
    shelfLoc: 'Worktable 3',
    totalQuantity: 6,
    stockQty: 6,
    availableQuantity: 6,
    usageType: 'Lab-Reference Only',
    maxLoanDurationDays: 1,
    status: 'Available',
    description: 'Safe switching apparatus for throwing on loads during generator sudden-load tests.'
  }
];

// Helper to generate realistic dates for the academic schedule
const createDate = (daysFromToday, hours = 9) => {
  const d = new Date();
  d.setDate(d.getDate() + daysFromToday);
  d.setHours(hours, 0, 0, 0);
  return d;
};

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

const seedAll = async () => {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected successfully.');

    // 1. Insert or update components
    console.log(`Seeding ${newComponents.length} new academic practical components...`);
    let addedCount = 0;
    let existingCount = 0;

    for (const comp of newComponents) {
      const exists = await Component.findOne({
        $or: [{ compId: comp.compId }, { name: comp.name }]
      });

      if (!exists) {
        await Component.create(comp);
        addedCount++;
      } else {
        existingCount++;
      }
    }
    console.log(`Components seeded: ${addedCount} newly created, ${existingCount} already present.`);

    // 2. Fetch default student Akila Jayan
    let student = await User.findOne({ uniEmail: 'akila@eng.ruh.ac.lk' });
    if (!student) {
      student = await User.findOne({ role: 'Student' });
    }

    // 3. Clear and seed Lab Sessions
    console.log('Seeding Semester 3 and 4 Lab Sessions...');
    await LabSession.deleteMany();

    const sessionDocs = practicalCurriculum.map((item, index) => {
      const sessionDate = createDate(item.scheduledDaysOffset);

      // Distribute some initial realistic statuses:
      // First 2 sessions for the student are 'In-Progress' or 'Completed - Pending Inspection'
      let status = 'Scheduled';
      let checkIn = null;
      let completion = null;
      let inspection = null;

      if (index === 0) {
        status = 'In-Progress';
        checkIn = new Date(Date.now() - 45 * 60 * 1000); // checked in 45 mins ago
      } else if (index === 4) {
        status = 'Completed';
        checkIn = new Date(Date.now() - 180 * 60 * 1000);
        completion = new Date(Date.now() - 15 * 60 * 1000); // finished 15 mins ago
        inspection = {
          remarks: 'Student finished practical setup. Ready for Lab Assistant sign-off.'
        };
      }

      return {
        sessionId: item.sessionId,
        courseCode: item.courseCode,
        courseName: item.courseName,
        semester: item.semester,
        labNumber: item.labNumber,
        title: item.title,
        labName: item.labName,
        worktable: item.worktable,
        scheduledDate: sessionDate,
        timeSlot: item.timeSlot,
        assignedStudent: student ? student._id : null,
        studentDetails: student ? {
          userId: student.userId,
          name: `${student.firstName} ${student.lastName}`,
          uniEmail: student.uniEmail
        } : {
          userId: 'STU001',
          name: 'Akila Jayan',
          uniEmail: 'akila@eng.ruh.ac.lk'
        },
        batch: item.semester === 3 ? 'E/21/EE-Sem3' : 'E/20/EE-Sem4',
        requiredEquipment: item.requiredEquipment,
        status: status,
        checkInTime: checkIn,
        completionTime: completion,
        adminInspection: inspection
      };
    });

    await LabSession.insertMany(sessionDocs);
    console.log(`Successfully created ${sessionDocs.length} Lab Sessions across Semester 3 & 4!`);

    console.log('Seeding finished successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Error during seeding:', err);
    process.exit(1);
  }
};

seedAll();
