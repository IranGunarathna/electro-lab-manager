// backend/seedComponents.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Component = require('./models/Component');
const Item = require('./models/Item');

dotenv.config();

// Helper to cycle worktables 1 to 12
const getWorktable = (index) => `Worktable ${(index % 12) + 1}`;

const labComponentsData = [
  // =========================================================================
  // 1. Undergraduate Project Development Laboratory
  // =========================================================================
  {
    lab: 'Undergraduate Project Development Laboratory',
    items: [
      // Reference Instruments & Tools
      {
        name: 'Digital Storage Oscilloscope (DSO)',
        spec: 'Rigol DS1054Z 50MHz 4-CH 1GSa/s',
        category: 'Equipment',
        usageType: 'Lab-Reference Only',
        maxLoanDurationDays: 1,
        totalQuantity: 12,
        availableQuantity: 12,
        description: '4-channel benchtop digital storage oscilloscope with 24Mpts memory depth and UltraVision display.'
      },
      {
        name: 'Temperature-Controlled Soldering Station',
        spec: 'Hakko FX-888D 70W ESD-Safe (200-480°C)',
        category: 'Tool',
        usageType: 'Lab-Reference Only',
        maxLoanDurationDays: 1,
        totalQuantity: 15,
        availableQuantity: 15,
        description: 'Digital temperature-controlled soldering station with thermal recovery and preset temperature modes.'
      },
      {
        name: 'Desoldering Pump and Solder Wick Kit',
        spec: 'High-Vacuum ESD Desoldering Pump & 2.5mm Chem-Wik',
        category: 'Tool',
        usageType: 'Takeaway Borrowable',
        maxLoanDurationDays: 3,
        totalQuantity: 30,
        availableQuantity: 30,
        description: 'Manual spring-loaded vacuum solder sucker with heat-resistant copper desoldering braid.'
      },
      {
        name: 'Benchtop Dual-Channel DC Power Supply',
        spec: 'Korad KA3005D 0-30V 0-5A Dual Linear Adjustable',
        category: 'Equipment',
        usageType: 'Lab-Reference Only',
        maxLoanDurationDays: 1,
        totalQuantity: 12,
        availableQuantity: 12,
        description: 'Low-noise linear DC power supply with digital display, over-current, and short-circuit protection.'
      },
      {
        name: 'Function / Arbitrary Waveform Generator',
        spec: 'Siglent SDG1032X 30MHz 2-CH 150MSa/s',
        category: 'Equipment',
        usageType: 'Lab-Reference Only',
        maxLoanDurationDays: 1,
        totalQuantity: 8,
        availableQuantity: 8,
        description: 'Dual-channel waveform generator with sine, square, ramp, pulse, and arbitrary signal outputs.'
      },
      {
        name: 'Solderless Breadboard (830 Tie Points)',
        spec: 'MB-102 830 Points with Dual Power Rails',
        category: 'Tool',
        usageType: 'Takeaway Borrowable',
        maxLoanDurationDays: 7,
        totalQuantity: 120,
        availableQuantity: 115,
        description: 'Standard transparent/white solderless breadboard with self-adhesive backing and distribution strips.'
      },
      {
        name: 'Digital Multimeter (Handheld True RMS)',
        spec: 'Fluke 117 True RMS with Non-Contact Voltage',
        category: 'Equipment',
        usageType: 'Takeaway Borrowable',
        maxLoanDurationDays: 3,
        totalQuantity: 24,
        availableQuantity: 24,
        description: 'Compact true-RMS meter for electricians and students with VoltAlert non-contact voltage detection.'
      },
      {
        name: 'Pre-cut Jumper Wire Kits (65 Pcs)',
        spec: 'M-M, M-F, F-F Flexible Breadboard Jumper Wires',
        category: 'Consumable',
        usageType: 'Consumable',
        maxLoanDurationDays: 0,
        totalQuantity: 100,
        availableQuantity: 100,
        description: 'Assorted color-coded multi-length copper jumper wires with molded pins.'
      },
      {
        name: 'Mini Rotary Hand Drill Tool',
        spec: 'Dremel 3000 Variable Speed (10,000-33,000 RPM)',
        category: 'Tool',
        usageType: 'Lab-Reference Only',
        maxLoanDurationDays: 1,
        totalQuantity: 6,
        availableQuantity: 6,
        description: 'High-speed rotary tool kit for PCB drilling, enclosure carving, and prototype trimming.'
      },
      {
        name: 'Handheld Precision LCR Meter',
        spec: 'DER EE DE-5000 Dual Display 100kHz LCR',
        category: 'Equipment',
        usageType: 'Takeaway Borrowable',
        maxLoanDurationDays: 3,
        totalQuantity: 8,
        availableQuantity: 8,
        description: 'High-accuracy handheld meter measuring inductance, capacitance, resistance, and ESR with Kelvin clips.'
      },
      {
        name: '3D Printer for Rapid Enclosure Prototyping',
        spec: 'Creality Ender-3 V3 KE (PLA/PETG/ABS)',
        category: 'Equipment',
        usageType: 'Lab-Reference Only',
        maxLoanDurationDays: 1,
        totalQuantity: 4,
        availableQuantity: 4,
        description: 'High-speed FDM 3D printer for creating custom robot chassis, sensor brackets, and project boxes.'
      },
      {
        name: 'Wire Stripper and Precision Flush Cutter',
        spec: 'Hakko CHP-170 Micro Cutters & Automatic Stripper',
        category: 'Tool',
        usageType: 'Takeaway Borrowable',
        maxLoanDurationDays: 3,
        totalQuantity: 40,
        availableQuantity: 40,
        description: 'Precision flush wire cutters and adjustable wire strippers for 10-24 AWG solid and stranded wires.'
      },
      {
        name: 'Anti-Static ESD Precision Tweezers Set',
        spec: 'ESD-10 to ESD-15 Stainless Steel Curved & Straight',
        category: 'Tool',
        usageType: 'Takeaway Borrowable',
        maxLoanDurationDays: 3,
        totalQuantity: 35,
        availableQuantity: 35,
        description: 'Non-magnetic anti-static tweezers set for SMD handling and fine circuit placement.'
      },
      {
        name: 'Solder Fume Extractor / Smoke Absorber',
        spec: 'Kotto Benchtop Activated Carbon Filter Unit',
        category: 'Equipment',
        usageType: 'Lab-Reference Only',
        maxLoanDurationDays: 1,
        totalQuantity: 12,
        availableQuantity: 12,
        description: 'High-efficiency benchtop smoke extractor with replaceable activated carbon filtration sponge.'
      },
      {
        name: 'ESD-Safe Conductive Workbench Mat',
        spec: '600mm x 400mm Heat-Resistant Silicone Mat (500°C)',
        category: 'Tool',
        usageType: 'Lab-Reference Only',
        maxLoanDurationDays: 1,
        totalQuantity: 16,
        availableQuantity: 16,
        description: 'Anti-static heat-resistant magnetic repair mat with integrated screw notches and parts trays.'
      },
      {
        name: 'Anti-Static Wrist Strap with Grounding Cord',
        spec: '1MΩ Safety Resistor with Coiled Ground Wire',
        category: 'Tool',
        usageType: 'Takeaway Borrowable',
        maxLoanDurationDays: 7,
        totalQuantity: 50,
        availableQuantity: 50,
        description: 'Elastic fabric conductive wrist band with 6ft polyurethane grounding coil and alligator clip.'
      },
      {
        name: 'Arduino Uno R3 Microcontroller Board',
        spec: 'ATmega328P 16MHz 5V with USB Cable',
        category: 'Microcontroller',
        usageType: 'Takeaway Borrowable',
        maxLoanDurationDays: 7,
        totalQuantity: 45,
        availableQuantity: 42,
        description: 'Standard 8-bit AVR development board with 14 digital I/O pins, 6 PWM channels, and 6 analog inputs.'
      },
      {
        name: 'Raspberry Pi 4 Model B (4GB RAM)',
        spec: 'Broadcom BCM2711 Quad-Core Cortex-A72 @ 1.5GHz',
        category: 'Microcontroller',
        usageType: 'Takeaway Borrowable',
        maxLoanDurationDays: 7,
        totalQuantity: 25,
        availableQuantity: 24,
        description: 'High-performance single board computer with dual micro-HDMI 4K, Gigabit Ethernet, and USB 3.0.'
      },
      {
        name: 'ESP32 Wi-Fi & Bluetooth Development Board',
        spec: 'ESP-WROOM-32 30-Pin Dual Core 240MHz',
        category: 'Microcontroller',
        usageType: 'Takeaway Borrowable',
        maxLoanDurationDays: 7,
        totalQuantity: 60,
        availableQuantity: 58,
        description: 'Dual-core MCU with integrated 802.11 b/g/n Wi-Fi, Bluetooth BLE 4.2, and 36 GPIO pins.'
      },
      {
        name: 'Adjustable Digital Heat Gun',
        spec: '2000W Dual Temperature (50-600°C) with Nozzles',
        category: 'Tool',
        usageType: 'Lab-Reference Only',
        maxLoanDurationDays: 1,
        totalQuantity: 5,
        availableQuantity: 5,
        description: 'Heavy duty hot air gun with reduction nozzles for heat-shrink tubing and SMD reflow preheating.'
      },
      {
        name: 'Polyolefin Heat Shrink Tubing Assortment',
        spec: '560 Pcs 2:1 Shrink Ratio (1mm to 13mm)',
        category: 'Consumable',
        usageType: 'Consumable',
        maxLoanDurationDays: 0,
        totalQuantity: 40,
        availableQuantity: 40,
        description: 'Flame retardant electrical wire insulation tubing organizer in multiple colors.'
      },
      {
        name: 'USB Logic Analyzer (24MHz 8-Channel)',
        spec: 'Saleae-Compatible 8-CH 24MS/s with EZ-USB',
        category: 'Equipment',
        usageType: 'Takeaway Borrowable',
        maxLoanDurationDays: 3,
        totalQuantity: 20,
        availableQuantity: 20,
        description: 'Compact USB logic analyzer for debugging I2C, SPI, UART, CAN, and 1-Wire digital bus protocols.'
      },
      {
        name: 'Illuminated Magnifying Desk Lamp',
        spec: '5X Diopter Glass Lens with Dimmable LED Ring',
        category: 'Tool',
        usageType: 'Lab-Reference Only',
        maxLoanDurationDays: 1,
        totalQuantity: 12,
        availableQuantity: 12,
        description: 'Clamp-on flexible gooseneck workbench magnifying lamp for micro-soldering and PCB inspection.'
      },
      {
        name: 'Hot Melt Glue Gun (60W)',
        spec: 'Rapid Heating with 11mm Adhesive Sticks',
        category: 'Tool',
        usageType: 'Takeaway Borrowable',
        maxLoanDurationDays: 3,
        totalQuantity: 15,
        availableQuantity: 15,
        description: 'Ergonomic glue gun with anti-drip insulated brass nozzle for prototype securing and cable relief.'
      },
      {
        name: 'Digital Vernier Caliper (150mm / 6-inch)',
        spec: 'Stainless Steel 0.01mm Resolution with LCD',
        category: 'Tool',
        usageType: 'Takeaway Borrowable',
        maxLoanDurationDays: 3,
        totalQuantity: 15,
        availableQuantity: 15,
        description: 'Precision electronic digital caliper for accurate inside, outside, depth, and step measurements.'
      },
      {
        name: 'IC Extractor & Insertion Tool Set',
        spec: 'U-Type DIP Extractor & PLCC Puller',
        category: 'Tool',
        usageType: 'Takeaway Borrowable',
        maxLoanDurationDays: 3,
        totalQuantity: 25,
        availableQuantity: 25,
        description: 'Stainless steel IC chip extractor tweezers preventing pin damage during breadboard removal.'
      },
      {
        name: 'Double-Sided Copper Clad Board (FR4)',
        spec: '100mm x 150mm 1.6mm Thickness (1oz Copper)',
        category: 'Consumable',
        usageType: 'Consumable',
        maxLoanDurationDays: 0,
        totalQuantity: 80,
        availableQuantity: 80,
        description: 'High quality double-sided copper laminate sheet for PCB milling and ferric chloride chemical etching.'
      },
      {
        name: 'Chemical PCB Etching Kit',
        spec: 'Anhydrous Ferric Chloride Powder (500g)',
        category: 'Consumable',
        usageType: 'Lab-Reference Only',
        maxLoanDurationDays: 1,
        totalQuantity: 10,
        availableQuantity: 10,
        description: 'Fast-acting copper etchant crystals for laboratory manual circuit board fabrication.'
      },
      {
        name: 'Safety Eyewear & Chemical Splash Goggles',
        spec: 'ANSI Z87.1 Polycarbonate Anti-Fog Goggles',
        category: 'Tool',
        usageType: 'Takeaway Borrowable',
        maxLoanDurationDays: 1,
        totalQuantity: 30,
        availableQuantity: 30,
        description: 'Impact-resistant protective clear safety goggles with indirect side vents.'
      },
      {
        name: 'Component Storage Organizer Cabinet',
        spec: '30-Drawer Transparent Multi-Compartment Unit',
        category: 'Tool',
        usageType: 'Lab-Reference Only',
        maxLoanDurationDays: 1,
        totalQuantity: 8,
        availableQuantity: 8,
        description: 'Impact resistant plastic drawer cabinet for classifying discrete passives and semiconductors.'
      },

      // =====================================================================
      // Specialized Electronic Circuit Components (ICs, Transistors, Diodes, Sensors)
      // =====================================================================
      {
        name: 'NE555 Precision Timer IC',
        spec: 'DIP-8 Package, 4.5V-16V Supply',
        category: 'Active Component',
        usageType: 'Consumable',
        maxLoanDurationDays: 0,
        totalQuantity: 200,
        availableQuantity: 200,
        description: 'Industry-standard analog timer IC for generating accurate timing pulses, PWM, and astable oscillation.'
      },
      {
        name: 'LM358 Dual Low-Power Operational Amplifier',
        spec: 'DIP-8 Package, Single/Dual Supply 3V-32V',
        category: 'Active Component',
        usageType: 'Consumable',
        maxLoanDurationDays: 0,
        totalQuantity: 250,
        availableQuantity: 250,
        description: 'Dual high-gain frequency-compensated op-amp designed specifically for single-supply sensor amplification.'
      },
      {
        name: 'LM741 General Purpose Op-Amp',
        spec: 'DIP-8 Package, ±15V Supply',
        category: 'Active Component',
        usageType: 'Consumable',
        maxLoanDurationDays: 0,
        totalQuantity: 180,
        availableQuantity: 180,
        description: 'Classic single operational amplifier with internal frequency compensation and short-circuit protection.'
      },
      {
        name: 'LM324 Quad Low-Power Operational Amplifier',
        spec: 'DIP-14 Package, 4 Independent Amplifiers',
        category: 'Active Component',
        usageType: 'Consumable',
        maxLoanDurationDays: 0,
        totalQuantity: 150,
        availableQuantity: 150,
        description: 'Quad op-amp IC allowing 4 separate active filter or amplifier stages in a single 14-pin DIP package.'
      },
      {
        name: 'LM393 Dual Differential Voltage Comparator',
        spec: 'DIP-8 Package, Open-Collector Output',
        category: 'Active Component',
        usageType: 'Consumable',
        maxLoanDurationDays: 0,
        totalQuantity: 140,
        availableQuantity: 140,
        description: 'Precision dual voltage comparator IC with low input offset voltage for threshold detection circuits.'
      },
      {
        name: 'LM7805 Linear Voltage Regulator (+5V 1.5A)',
        spec: 'TO-220 Package, +5V Output, Thermal Overload Protection',
        category: 'Active Component',
        usageType: 'Consumable',
        maxLoanDurationDays: 0,
        totalQuantity: 180,
        availableQuantity: 180,
        description: 'Positive 3-terminal voltage regulator providing clean 5V DC power for microcontrollers and digital logic.'
      },
      {
        name: 'LM7812 Linear Voltage Regulator (+12V 1.5A)',
        spec: 'TO-220 Package, +12V Output',
        category: 'Active Component',
        usageType: 'Consumable',
        maxLoanDurationDays: 0,
        totalQuantity: 120,
        availableQuantity: 120,
        description: 'Fixed 12V positive voltage regulator for relay drivers, cooling fans, and operational amplifier rails.'
      },
      {
        name: 'LM317T Adjustable Voltage Regulator',
        spec: 'TO-220 Package, 1.25V to 37V Output, 1.5A Max',
        category: 'Active Component',
        usageType: 'Consumable',
        maxLoanDurationDays: 0,
        totalQuantity: 130,
        availableQuantity: 130,
        description: 'Versatile adjustable 3-terminal positive regulator configured using two external resistors.'
      },
      {
        name: 'AMS1117-3.3V Low-Dropout (LDO) Regulator',
        spec: 'SOT-223 / Breadboard Breakout, 3.3V 800mA',
        category: 'Active Component',
        usageType: 'Consumable',
        maxLoanDurationDays: 0,
        totalQuantity: 160,
        availableQuantity: 160,
        description: 'Low-dropout positive regulator ideal for supplying 3.3V to ESP32, STM32, and digital sensors.'
      },
      {
        name: '74HC00 Quad 2-Input NAND Gate IC',
        spec: 'DIP-14 Package, High-Speed CMOS',
        category: 'Active Component',
        usageType: 'Consumable',
        maxLoanDurationDays: 0,
        totalQuantity: 100,
        availableQuantity: 100,
        description: 'Universal logic building block containing four independent 2-input NAND gates with CMOS noise immunity.'
      },
      {
        name: '74HC04 Hex Inverter (NOT Gate) IC',
        spec: 'DIP-14 Package, 6 Independent Inverters',
        category: 'Active Component',
        usageType: 'Consumable',
        maxLoanDurationDays: 0,
        totalQuantity: 110,
        availableQuantity: 110,
        description: 'High-speed CMOS hex inverting gate for clock pulse conditioning and logic level inversion.'
      },
      {
        name: '74HC08 Quad 2-Input AND Gate IC',
        spec: 'DIP-14 Package, 4 Independent Gates',
        category: 'Active Component',
        usageType: 'Consumable',
        maxLoanDurationDays: 0,
        totalQuantity: 100,
        availableQuantity: 100,
        description: 'Standard 4-channel 2-input positive AND logic gate IC for digital combination logic design.'
      },
      {
        name: '74HC32 Quad 2-Input OR Gate IC',
        spec: 'DIP-14 Package, 4 Independent Gates',
        category: 'Active Component',
        usageType: 'Consumable',
        maxLoanDurationDays: 0,
        totalQuantity: 100,
        availableQuantity: 100,
        description: 'Quadruple 2-input positive-OR gates with buffered digital outputs and wide operating voltage.'
      },
      {
        name: '74HC595 8-Bit Serial-In Parallel-Out Shift Register',
        spec: 'DIP-16 Package, Tri-State Output Latch',
        category: 'Active Component',
        usageType: 'Consumable',
        maxLoanDurationDays: 0,
        totalQuantity: 120,
        availableQuantity: 120,
        description: 'High-speed 8-bit shift register with storage register latch for expanding microcontroller GPIO pins.'
      },
      {
        name: 'CD4017 Decade Counter / Divider IC',
        spec: 'DIP-16 Package, 10 Decoded Outputs',
        category: 'Active Component',
        usageType: 'Consumable',
        maxLoanDurationDays: 0,
        totalQuantity: 90,
        availableQuantity: 90,
        description: 'Johnson 10-stage decade counter with decoded active-high outputs for LED chaser and sequencer circuits.'
      },
      {
        name: '2N2222A NPN Bipolar Junction Transistor',
        spec: 'TO-92 Package, 40V 800mA, hFE 100-300',
        category: 'Active Component',
        usageType: 'Consumable',
        maxLoanDurationDays: 0,
        totalQuantity: 300,
        availableQuantity: 300,
        description: 'Classic high-speed NPN switching transistor for driving relays, small DC motors, and signal amplification.'
      },
      {
        name: 'BC547 NPN General Purpose Audio/Switching Transistor',
        spec: 'TO-92 Package, 45V 100mA, High Gain',
        category: 'Active Component',
        usageType: 'Consumable',
        maxLoanDurationDays: 0,
        totalQuantity: 350,
        availableQuantity: 350,
        description: 'Low-noise NPN epitaxial silicon transistor for audio preamplifiers and sensitive sensor switching.'
      },
      {
        name: 'BC557 PNP General Purpose Transistor',
        spec: 'TO-92 Package, -45V 100mA',
        category: 'Active Component',
        usageType: 'Consumable',
        maxLoanDurationDays: 0,
        totalQuantity: 250,
        availableQuantity: 250,
        description: 'Complementary PNP transistor for push-pull power stages, H-bridge switches, and current mirrors.'
      },
      {
        name: 'IRF540N N-Channel Power MOSFET',
        spec: 'TO-220 Package, 100V 33A, Rds(on) 44mΩ',
        category: 'Active Component',
        usageType: 'Consumable',
        maxLoanDurationDays: 0,
        totalQuantity: 150,
        availableQuantity: 150,
        description: 'Heavy duty N-channel power MOSFET for high-efficiency DC motor PWM speed control and power switching.'
      },
      {
        name: 'TIP120 NPN Darlington Power Transistor',
        spec: 'TO-220 Package, 60V 5A, High Gain hFE 1000',
        category: 'Active Component',
        usageType: 'Consumable',
        maxLoanDurationDays: 0,
        totalQuantity: 100,
        availableQuantity: 100,
        description: 'Monolithic Darlington transistor with integrated damper diode for high current solenoid and motor loads.'
      },
      {
        name: '1N4007 1A 1000V Silicon Rectifier Diode',
        spec: 'DO-41 Leaded Package, 1A 1000V Peak Reverse',
        category: 'Passive Component',
        usageType: 'Consumable',
        maxLoanDurationDays: 0,
        totalQuantity: 400,
        availableQuantity: 400,
        description: 'General purpose power rectifier diode with high forward surge capability and low reverse leakage.'
      },
      {
        name: '1N4148 High-Speed Small Signal Switching Diode',
        spec: 'DO-35 Glass Package, 4ns Recovery Time, 100V',
        category: 'Passive Component',
        usageType: 'Consumable',
        maxLoanDurationDays: 0,
        totalQuantity: 350,
        availableQuantity: 350,
        description: 'Ultra fast planar switching diode for RF clipping, demodulation, and high frequency waveform shaping.'
      },
      {
        name: '1N4733A 5.1V 1W Zener Diode',
        spec: 'DO-41 Glass Package, 5.1V Vz, 1 Watt',
        category: 'Passive Component',
        usageType: 'Consumable',
        maxLoanDurationDays: 0,
        totalQuantity: 200,
        availableQuantity: 200,
        description: 'Precision voltage reference Zener diode for voltage clamping and 5V over-voltage protection.'
      },
      {
        name: 'PC817 4-Pin Phototransistor Optocoupler',
        spec: 'DIP-4 Package, 5kV Isolation Voltage',
        category: 'Active Component',
        usageType: 'Consumable',
        maxLoanDurationDays: 0,
        totalQuantity: 150,
        availableQuantity: 150,
        description: 'Optical isolator IC isolating sensitive microcontroller logic from noisy high-voltage industrial circuits.'
      },
      {
        name: '5mm Diffused LED Assortment (Red, Green, Blue, Yellow)',
        spec: 'Forward Voltage 1.8V-3.2V, 20mA (100 Pcs/Pack)',
        category: 'Passive Component',
        usageType: 'Consumable',
        maxLoanDurationDays: 0,
        totalQuantity: 500,
        availableQuantity: 500,
        description: 'Bright diffused indicator light emitting diodes for circuit diagnostics and user interfaces.'
      },
      {
        name: 'HC-SR04 Ultrasonic Distance Sensor Module',
        spec: '2cm to 400cm Non-Contact Range, 5V Trigger/Echo',
        category: 'Sensor',
        usageType: 'Takeaway Borrowable',
        maxLoanDurationDays: 7,
        totalQuantity: 40,
        availableQuantity: 38,
        description: 'Ultrasonic sonar transducer module with 3mm precision for robot obstacle detection and ranging.'
      },
      {
        name: 'DHT22 Digital Temperature and Humidity Sensor',
        spec: 'AM2302 Single Bus, -40 to 80°C (±0.5°C), 0-100% RH',
        category: 'Sensor',
        usageType: 'Takeaway Borrowable',
        maxLoanDurationDays: 7,
        totalQuantity: 35,
        availableQuantity: 34,
        description: 'Calibrated digital composite sensor with dedicated digital signal acquisition technique.'
      },
      {
        name: 'MPU-6050 6-Axis Accelerometer and Gyroscope',
        spec: 'I2C Interface, 3-Axis Gyro + 3-Axis Accelerometer (DMP)',
        category: 'Sensor',
        usageType: 'Takeaway Borrowable',
        maxLoanDurationDays: 7,
        totalQuantity: 30,
        availableQuantity: 30,
        description: 'Motion tracking sensor with integrated Digital Motion Processor (DMP) for robotics balance and UAVs.'
      },
      {
        name: '16x2 Character LCD Module with I2C Backback',
        spec: 'HD44780 Controller with PCF8574T I2C Interface (0x27)',
        category: 'Module',
        usageType: 'Takeaway Borrowable',
        maxLoanDurationDays: 7,
        totalQuantity: 35,
        availableQuantity: 35,
        description: 'Alphanumeric display requiring only 2 microcontroller pins (SDA/SCL) with blue backlight and contrast pot.'
      },
      {
        name: 'L298N Dual Full-Bridge DC Motor Driver Module',
        spec: '5V-35V 2A Peak per Channel with Stepper Support',
        category: 'Module',
        usageType: 'Takeaway Borrowable',
        maxLoanDurationDays: 7,
        totalQuantity: 30,
        availableQuantity: 28,
        description: 'Heavy duty motor controller board with integrated 7805 5V regulator and heat sink for robotics.'
      }
    ]
  },

  // =========================================================================
  // 2. Networking Laboratory
  // =========================================================================
  {
    lab: 'Networking Laboratory',
    items: [
      { name: 'Enterprise Core Router', spec: 'Cisco Catalyst 8300 Edge Series (4x 10GE, Modular)', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 6, availableQuantity: 6, description: 'Enterprise-grade edge router for WAN aggregation, IPSec VPN, and SD-WAN architecture.' },
      { name: '24-Port Managed Gigabit Ethernet Switch', spec: 'Cisco Catalyst 2960-X 24 GigE PoE+ 370W', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 12, availableQuantity: 12, description: 'Layer 2 stackable enterprise switch supporting 802.1Q VLANs, QoS, and PoE+ line power.' },
      { name: 'Unmanaged 8-Port Desktop Switch', spec: 'TP-Link TL-SG108 8-Port Gigabit Metal Housing', category: 'Tool', usageType: 'Takeaway Borrowable', maxLoanDurationDays: 3, totalQuantity: 20, availableQuantity: 20, description: 'Plug-and-play desktop switch for student subgroup network topologies.' },
      { name: 'Next-Generation Hardware Security Firewall', spec: 'Fortinet FortiGate 60F Unified Threat Defense', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 4, availableQuantity: 4, description: 'Hardware firewall appliance for packet inspection, SSL VPN, and intrusion prevention testing.' },
      { name: 'Enterprise Wi-Fi 6 Access Point', spec: 'Aruba AP-505 Dual Radio 2x2:2 802.11ax', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 8, availableQuantity: 8, description: 'High performance ceiling/wall mount wireless access point with WPA3 enterprise security.' },
      { name: 'Wireless LAN Controller (WLC)', spec: 'Cisco 3504 Compact WLC (Up to 150 APs)', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 3, availableQuantity: 3, description: 'Centralized wireless management controller for RF optimization and rapid AP deployment.' },
      { name: 'RJ-45 Ratcheting Crimping Tool', spec: 'Heavy Duty Modular Crimper for RJ45/RJ11/Cat6', category: 'Tool', usageType: 'Takeaway Borrowable', maxLoanDurationDays: 3, totalQuantity: 25, availableQuantity: 25, description: 'Steel ratcheting crimper with integrated cable stripper and precision cutter.' },
      { name: 'Network Cable Continuity Tester', spec: 'Master/Remote LED RJ45/RJ11 Wiremap Tester', category: 'Tool', usageType: 'Takeaway Borrowable', maxLoanDurationDays: 3, totalQuantity: 25, availableQuantity: 25, description: 'Automatic scan tester verifying pin-by-pin continuity, short circuits, and crossed pairs.' },
      { name: 'Bulk Cat6 UTP Solid Copper Cable (305m)', spec: '23 AWG 550MHz Unshielded Twisted Pair Spool', category: 'Consumable', usageType: 'Consumable', maxLoanDurationDays: 0, totalQuantity: 8, availableQuantity: 8, description: 'High performance pure copper Ethernet cable spool for custom patch lead fabrication.' },
      { name: 'Optical Fiber Fusion Splicing Machine', spec: 'Fujikura 70S+ Core Alignment Fusion Splicer', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 2, availableQuantity: 2, description: 'Automated ultra-low loss core alignment fiber splicer with built-in tube heater.' },
      { name: 'Optical Time-Domain Reflectometer (OTDR)', spec: 'EXFO FTB-1v2 with 1310/1550nm Single-Mode Module', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 2, availableQuantity: 2, description: 'Precision fiber testing instrument for locating fiber breaks, splice loss, and reflectance.' },
      { name: 'Rack-Mount 24-Port Cat6 Patch Panel', spec: '1U 19-inch 110/Krone Punch Down Patch Panel', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 10, availableQuantity: 10, description: 'T568A/B universal wiring patch panel for standardized rack cable termination.' },
      { name: '42U Standard Server Enclosure Rack', spec: 'EIA-310-D Standard 800mm x 1000mm Glass/Perforated', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 4, availableQuantity: 4, description: 'Full-depth floor standing server rack with cable management ducts and grounding bus.' },
      { name: 'Network Attached Storage (NAS) Array', spec: 'Synology DiskStation DS923+ 4-Bay (4x 4TB RAID5)', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 3, availableQuantity: 3, description: 'Network storage server supporting iSCSI targets, NFS shares, and automated network backups.' },
      { name: '8-Port USB/HDMI Rackmount KVM Switch', spec: 'ATEN CS1798 1U Multi-System Console Controller', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 4, availableQuantity: 4, description: 'Allows controlling multiple network servers and routers from a single console station.' },
      { name: 'Online Double-Conversion Rackmount UPS', spec: 'APC Smart-UPS On-Line 3000VA 230V 2U (SRT3000XLI)', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 4, availableQuantity: 4, description: 'Zero-transfer-time sine wave backup power supply with network management card.' },
      { name: 'Rack-Mount Application Server (1U)', spec: 'Dell PowerEdge R350 (Intel Xeon E-2336, 32GB RAM)', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 6, availableQuantity: 6, description: 'Rack server hosting local DNS, DHCP, RADIUS, and network simulation environments.' },
      { name: 'Fiber Optic Patch Cord Kit (LC-LC, SC-LC)', spec: 'Single-Mode 9/125µm & Multi-Mode OM4 Duplex (3m)', category: 'Tool', usageType: 'Takeaway Borrowable', maxLoanDurationDays: 3, totalQuantity: 40, availableQuantity: 40, description: 'Low-insertion-loss pre-terminated optical jumper cables with ceramic ferrules.' },
      { name: 'Optical Power Meter & Visual Fault Locator', spec: '850-1625nm Range with 10mW 650nm Red Laser VFL', category: 'Tool', usageType: 'Takeaway Borrowable', maxLoanDurationDays: 3, totalQuantity: 8, availableQuantity: 8, description: 'Dual optical test unit for dBm power loss measurement and visual fiber fault tracing.' },
      { name: '110/Krone Impact Wire Punch-Down Tool', spec: 'Spring-Loaded Impact Tool with Reversible Cut Blade', category: 'Tool', usageType: 'Takeaway Borrowable', maxLoanDurationDays: 3, totalQuantity: 20, availableQuantity: 20, description: 'Ergonomic punch-down tool for seating and trimming cables in patch panels and keystone jacks.' },
      { name: 'Hardware Ethernet Protocol Analyzer', spec: 'Dualcomm ET-1000 10/100/1000M USB-Powered TAP', category: 'Equipment', usageType: 'Takeaway Borrowable', maxLoanDurationDays: 3, totalQuantity: 6, availableQuantity: 6, description: 'Zero-packet-loss inline hardware monitoring tap for Wireshark traffic capture.' },
      { name: 'Digital Wire Tracer and Toner Probe Kit', spec: 'Fluke Pro3000 Analog Tone and Probe Kit', category: 'Tool', usageType: 'Takeaway Borrowable', maxLoanDurationDays: 3, totalQuantity: 8, availableQuantity: 8, description: 'Tone generator and inductive probe for identifying hidden cables through drywall and wire bundles.' },
      { name: 'SFP/SFP+ Optical Transceiver Modules (10G)', spec: '10GBASE-SR (850nm) and 10GBASE-LR (1310nm) Duplex', category: 'Active Component', usageType: 'Takeaway Borrowable', maxLoanDurationDays: 3, totalQuantity: 24, availableQuantity: 24, description: 'Hot-pluggable optical transceiver modules for high-speed switch-to-switch uplinks.' },
      { name: 'Desktop Wireshark Packet Analysis Station', spec: 'Intel Core i7 16GB RAM with Dedicated Dual NICs', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 12, availableQuantity: 12, description: 'Workstation configured with Kali Linux, Wireshark, tcpdump, and Cisco Packet Tracer.' },
      { name: 'Metered Smart Power Distribution Unit (PDU)', spec: 'APC NetShelter 16A 230V 1U Horizontal PDU', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 6, availableQuantity: 6, description: 'Rack PDU with digital current readout and remote IP-based outlet power monitoring.' },
      { name: 'RJ-45 and SFP Hardware Loopback Plugs', spec: 'Gigabit Copper Loopback & LC Fiber Loopback', category: 'Tool', usageType: 'Takeaway Borrowable', maxLoanDurationDays: 3, totalQuantity: 30, availableQuantity: 30, description: 'Diagnostic loopback adapters for testing NIC transceiver transmission and port integrity.' },
      { name: 'PCIe Dual-Port Gigabit Ethernet Server NIC', spec: 'Intel I350-T2 Dual Port PCIe x4 Adapter', category: 'Active Component', usageType: 'Takeaway Borrowable', maxLoanDurationDays: 3, totalQuantity: 16, availableQuantity: 16, description: 'High performance PCI Express network card supporting VLAN tagging and Jumbo frames.' },
      { name: 'FTDI USB-to-RJ45 Serial Console Cable', spec: 'FT232R Chipset 1.8m Flat Ribbon Console Cable', category: 'Tool', usageType: 'Takeaway Borrowable', maxLoanDurationDays: 3, totalQuantity: 30, availableQuantity: 30, description: 'Universal console cable connecting laptop USB ports to Cisco/Juniper router rollover ports.' },
      { name: 'Rack Environmental Monitoring Sensor', spec: 'Temperature, Humidity, and Door Contact Sensor', category: 'Sensor', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 6, availableQuantity: 6, description: 'Ethernet-connected environmental probe alerting on server cabinet thermal anomalies.' },
      { name: 'Industrial Thermal Cable Label Maker', spec: 'Brother P-Touch PT-E550W Heat Shrink & Wrap Labeler', category: 'Tool', usageType: 'Takeaway Borrowable', maxLoanDurationDays: 1, totalQuantity: 4, availableQuantity: 4, description: 'Handheld industrial labeler creating durable vinyl wire wraps and patch panel labels.' }
    ]
  },

  // =========================================================================
  // 3. Computer and Information Engineering Laboratory
  // =========================================================================
  {
    lab: 'Computer and Information Engineering Laboratory',
    items: [
      { name: 'High-End Multi-Core Workstation PC', spec: 'Intel Core i9-14900K 64GB DDR5 RTX 4080 16GB', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 16, availableQuantity: 16, description: 'Heavy-duty computer engineering workstation for EDA synthesis and machine learning simulations.' },
      { name: 'FPGA Development Board (Xilinx Artix-7)', spec: 'Digilent Basys 3 Artix-7 FPGA Trainer (XC7A35T)', category: 'Microcontroller', usageType: 'Takeaway Borrowable', maxLoanDurationDays: 7, totalQuantity: 24, availableQuantity: 24, description: 'Entry-level FPGA development board with onboard switches, 7-segments, VGA, and USB-JTAG.' },
      { name: 'ARM Cortex-M4 Microcontroller Trainer Kit', spec: 'STM32F4-Discovery Board (STM32F407VG MCU)', category: 'Microcontroller', usageType: 'Takeaway Borrowable', maxLoanDurationDays: 7, totalQuantity: 30, availableQuantity: 28, description: 'Evaluation board with 168MHz Cortex-M4 core, audio DAC, accelerometer, and ST-LINK/V2.' },
      { name: '8051 Architecture Evaluation Board', spec: 'AT89S52 Classic 8051 Microcontroller Trainer', category: 'Microcontroller', usageType: 'Takeaway Borrowable', maxLoanDurationDays: 7, totalQuantity: 20, availableQuantity: 20, description: 'Legacy microcontroller development kit for learning assembly language and low-level interrupts.' },
      { name: 'High-Speed Logic Analyzer (16-Channel)', spec: 'Kingst LA2016 200MSa/s 16-CH USB Logic Analyzer', category: 'Equipment', usageType: 'Takeaway Borrowable', maxLoanDurationDays: 3, totalQuantity: 12, availableQuantity: 12, description: 'Digital signal debugger capable of decoding PWM, SPI, I2C, CAN, and asynchronous serial buses.' },
      { name: 'JTAG Hardware Emulator and Debugger', spec: 'SEGGER J-Link EDU Base ARM JTAG/SWD Debugger', category: 'Tool', usageType: 'Takeaway Borrowable', maxLoanDurationDays: 3, totalQuantity: 15, availableQuantity: 15, description: 'High-speed hardware debugging probe providing real-time in-circuit breakpoint debugging.' },
      { name: 'Universal EPROM/EEPROM/Flash Programmer', spec: 'XGecu T48 (TL866-3G) Universal 40-Pin ZIF Programmer', category: 'Equipment', usageType: 'Takeaway Borrowable', maxLoanDurationDays: 3, totalQuantity: 6, availableQuantity: 6, description: 'High-voltage universal chip programmer supporting over 31,000 ICs, microcontrollers, and BIOS chips.' },
      { name: 'Mixed-Signal Oscilloscope (MSO)', spec: 'Rigol MSO5074 70MHz 4-CH (16 Digital Logic CH)', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 8, availableQuantity: 8, description: 'Oscilloscope combining analog waveforms with 16-channel synchronized digital logic analysis.' },
      { name: 'DSP Evaluation Module (Texas Instruments)', spec: 'TI TMS320C6748 DSP Development Kit (LCDK)', category: 'Microcontroller', usageType: 'Takeaway Borrowable', maxLoanDurationDays: 7, totalQuantity: 12, availableQuantity: 12, description: 'Floating-point DSP board optimized for real-time digital audio processing and FFT computation.' },
      { name: 'Dual-Monitor Articulated Workstation Mount', spec: 'Heavy-Duty Gas Spring Dual Monitor Arm (VESA 100)', category: 'Tool', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 16, availableQuantity: 16, description: 'Full-motion dual arm mount allowing panoramic multi-window code and schematic debugging.' },
      { name: 'Dedicated Edge AI GPU Compute Node', spec: 'NVIDIA Jetson Orin Nano Developer Kit (8GB)', category: 'Microcontroller', usageType: 'Takeaway Borrowable', maxLoanDurationDays: 7, totalQuantity: 16, availableQuantity: 15, description: 'Compact AI supercomputer board delivering up to 40 TOPS of AI inference performance.' },
      { name: 'Hypervisor Server for Virtualization Labs', spec: 'Dell PowerEdge R750 (2x Intel Xeon Gold, 128GB RAM)', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 2, availableQuantity: 2, description: 'Enterprise virtualization server hosting student VM sandbox environments (Proxmox/ESXi).' },
      { name: 'High-Speed ADC / DAC Breakout Module', spec: 'Pmod AD1 (Dual 12-Bit 1MSPS ADC) & DA2 (DAC)', category: 'Module', usageType: 'Takeaway Borrowable', maxLoanDurationDays: 3, totalQuantity: 20, availableQuantity: 20, description: 'FPGA peripheral modules for analog signal sampling and arbitrary waveform synthesis.' },
      { name: 'Powered Educational Breadboard Station', spec: 'Global Specialties PB-503 Analog/Digital Trainer', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 12, availableQuantity: 12, description: 'Complete workstation with integrated DC supplies, function generator, and logic switches.' },
      { name: '4x4 Keypad and 16x2 LCD Interfacing Module', spec: 'Matrix Keypad & Character Display Trainer Board', category: 'Module', usageType: 'Takeaway Borrowable', maxLoanDurationDays: 7, totalQuantity: 25, availableQuantity: 25, description: 'Standard input/output expansion board for MCU student lab assignments.' },
      { name: 'Stepper Motor & ULN2003 Driver Module', spec: '28BYJ-48 5V Stepper Motor with ULN2003 Driver', category: 'Module', usageType: 'Takeaway Borrowable', maxLoanDurationDays: 7, totalQuantity: 30, availableQuantity: 30, description: '4-phase 5-wire reduction stepper motor board with LED phase indicators.' },
      { name: 'Traffic Light Simulation Interface Board', spec: '4-Way Junction Red/Amber/Green LED Logic Board', category: 'Module', usageType: 'Takeaway Borrowable', maxLoanDurationDays: 7, totalQuantity: 20, availableQuantity: 20, description: 'Educational junction simulator for teaching finite state machines (FSM) on microcontrollers.' },
      { name: 'VLSI CPLD Trainer Board', spec: 'Altera MAX II EPM240 CPLD Development Board', category: 'Microcontroller', usageType: 'Takeaway Borrowable', maxLoanDurationDays: 7, totalQuantity: 18, availableQuantity: 18, description: 'Non-volatile CPLD board for hardware digital logic design and Verilog HDL assignments.' },
      { name: 'External USB 3.2 NVMe SSD (1TB)', spec: 'Samsung T7 Portable SSD 1050MB/s Read Speed', category: 'Tool', usageType: 'Takeaway Borrowable', maxLoanDurationDays: 3, totalQuantity: 15, availableQuantity: 15, description: 'Rugged portable drive for transporting large VM images and OS container files.' },
      { name: 'USB-to-Serial TTL UART Adapter Module', spec: 'FTDI FT232RL Chipset with 3.3V/5V Jumper', category: 'Tool', usageType: 'Takeaway Borrowable', maxLoanDurationDays: 3, totalQuantity: 50, availableQuantity: 50, description: 'Essential bridge cable connecting microcontroller serial ports to computer terminal emulators.' },
      { name: 'Sound and LED Digital Logic Probe', spec: 'Elenco LP-560 Digital Logic Probe (Pulse/High/Low)', category: 'Tool', usageType: 'Takeaway Borrowable', maxLoanDurationDays: 3, totalQuantity: 25, availableQuantity: 25, description: 'Handheld diagnostic probe detecting digital TTL and CMOS logic levels with audible tones.' },
      { name: 'Static Dissipative Flooring / Matting', spec: 'ESD 2-Layer Rubber Mat with Stud Ground Lead', category: 'Tool', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 12, availableQuantity: 12, description: 'Workstation protection surface preventing electrostatic discharge onto sensitive semiconductor dies.' },
      { name: 'Raspberry Pi Pico RP2040 Microcontroller', spec: 'Dual ARM Cortex-M0+ 133MHz 2MB Flash', category: 'Microcontroller', usageType: 'Takeaway Borrowable', maxLoanDurationDays: 7, totalQuantity: 50, availableQuantity: 50, description: 'Silicon MCU board designed by Raspberry Pi featuring unique Programmable I/O (PIO).' },
      { name: 'PCIe 10G Base-T Network Card', spec: 'ASUS XG-C100C 10G PCIe x4 Adapter (Aquantia AQC107)', category: 'Active Component', usageType: 'Takeaway Borrowable', maxLoanDurationDays: 3, totalQuantity: 10, availableQuantity: 10, description: 'Ultra-fast networking card for high-bandwidth data acquisition directly into host memory.' },
      { name: 'Multi-Protocol IoT Gateway Kit', spec: 'Raspberry Pi Gateway with Zigbee & LoRaWAN HAT', category: 'Module', usageType: 'Takeaway Borrowable', maxLoanDurationDays: 7, totalQuantity: 10, availableQuantity: 10, description: 'Wireless sensor hub bridging 868/915MHz LoRa field telemetry to local MQTT brokers.' },
      { name: 'Hardware Security Module (HSM) Token', spec: 'Yubico YubiKey 5 NFC Hardware Security Token', category: 'Tool', usageType: 'Takeaway Borrowable', maxLoanDurationDays: 3, totalQuantity: 12, availableQuantity: 12, description: 'Hardware cryptographic key generator for demonstrating FIDO2 and asymmetric RSA encryption.' },
      { name: 'Rugged External Backup Hard Drive (2TB)', spec: 'WD My Passport 2TB USB 3.0 Portable Drive', category: 'Tool', usageType: 'Takeaway Borrowable', maxLoanDurationDays: 3, totalQuantity: 10, availableQuantity: 10, description: 'Password-protected external storage for student project archives and OS snapshots.' },
      { name: 'Multi-Meter Automated Bench System', spec: 'Agilent/Keysight 34401A 6.5 Digit Precision DMM', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 6, availableQuantity: 6, description: 'Industry benchmark precision multimeter with GPIB/RS-232 computer data acquisition.' },
      { name: 'Embedded Linux Board (BeagleBone Black)', spec: 'TI Sitara AM3358 ARM Cortex-A8 1GHz 4GB eMMC', category: 'Microcontroller', usageType: 'Takeaway Borrowable', maxLoanDurationDays: 7, totalQuantity: 15, availableQuantity: 15, description: 'Industrial Linux computer board with dual 200MHz PRU real-time coprocessors.' },
      { name: '4K HDMI KVM Extender over Cat6 (100m)', spec: 'Zero-Latency HDBaseT Transmitter & Receiver Set', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 4, availableQuantity: 4, description: 'Extends keyboard, mouse, and high-definition video from remote server racks to student benches.' }
    ]
  },

  // =========================================================================
  // 4. Communication and Systems Laboratory
  // =========================================================================
  {
    lab: 'Communication and Systems Laboratory',
    items: [
      { name: 'RF Vector Signal Generator', spec: 'Rohde & Schwarz SMBV100B 9kHz to 3GHz (120MHz RF BW)', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 2, availableQuantity: 2, description: 'State-of-the-art RF signal generator synthesizing complex digital modulation schemes.' },
      { name: 'RF Spectrum Analyzer', spec: 'Rigol DSA815-TG 9kHz to 1.5GHz with Tracking Generator', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 8, availableQuantity: 8, description: 'Benchtop spectrum analyzer for frequency domain analysis, harmonics, and EMI testing.' },
      { name: 'Vector Network Analyzer (VNA)', spec: 'NanoVNA-V2 Plus4 50kHz to 4GHz Dual Port VNA', category: 'Equipment', usageType: 'Takeaway Borrowable', maxLoanDurationDays: 3, totalQuantity: 10, availableQuantity: 10, description: 'Handheld vector network analyzer measuring S11 and S21 parameters for filters and antennas.' },
      { name: 'AM/FM Analog Communication Trainer Kit', spec: 'Scientech 2201 DSB/SSB AM & FM Modulator/Demodulator', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 12, availableQuantity: 12, description: 'Modular trainer with test points for inspecting carrier waves, modulation index, and envelope detection.' },
      { name: 'ASK / FSK / PSK Digital Modulation Trainer', spec: 'Scientech 2206 Shift Keying Digital Comm Trainer', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 10, availableQuantity: 10, description: 'Comprehensive kit demonstrating binary amplitude, frequency, and phase shift keying circuits.' },
      { name: 'Pulse Code Modulation (PCM) Trainer Kit', spec: 'Scientech 2203 Sampling & Quantization PCM Trainer', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 10, availableQuantity: 10, description: 'Demonstrates Nyquist-Shannon sampling theorem, A/D quantization, and companding laws.' },
      { name: 'Delta Modulation / Demodulation Module', spec: 'Adaptive Delta Modulator Trainer (ADM/CVSD)', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 8, availableQuantity: 8, description: 'Teaches slope overload distortion, hunting noise, and adaptive step-size tracking.' },
      { name: 'Motorized Antenna Radiation Pattern Trainer', spec: 'Automated 360° Stepper Rotator with Yagi & Horn Antennas', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 2, availableQuantity: 2, description: 'Plots E-plane and H-plane radiation beam patterns and directivity gain automatically on PC.' },
      { name: 'Microwave X-Band Test Bench (8-12 GHz)', spec: 'Gunn Oscillator, Klystron Tube, Isolator & Waveguide Bench', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 4, availableQuantity: 4, description: 'Precision slotted waveguide bench measuring standing wave ratio (SWR) and waveguide wavelength.' },
      { name: 'Fiber Optic Communication Trainer Kit', spec: '650nm & 850nm LED/Laser Transmitter with PIN Receiver', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 12, availableQuantity: 12, description: 'Investigates numerical aperture, attenuation loss, and fiber optical link transmission.' },
      { name: 'Optical Spectrum Analyzer (Benchtop)', spec: 'Anritsu MS9740B Optical Spectrum Analyzer (600-1750nm)', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 1, availableQuantity: 1, description: 'High-resolution optical analyzer evaluating laser diode spectrum and WDM multiplexed signals.' },
      { name: 'Bit Error Rate (BER) Tester', spec: 'PRBS Pattern Generator & Error Detector (Up to 100Mbps)', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 4, availableQuantity: 4, description: 'Instruments generating pseudo-random binary sequences to measure communication channel BER.' },
      { name: 'Software-Defined Radio (SDR) Platform', spec: 'HackRF One 1MHz to 6GHz SDR Transceiver', category: 'Equipment', usageType: 'Takeaway Borrowable', maxLoanDurationDays: 3, totalQuantity: 12, availableQuantity: 12, description: 'Wideband open-source hardware SDR transceiver for GNU Radio signal processing experiments.' },
      { name: 'Baseband Arbitrary Signal Generator', spec: 'Tektronix AFG3102C Dual-Channel 100MHz 1GSa/s', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 6, availableQuantity: 6, description: 'Ultra-low jitter signal source producing standard baseband I/Q modulation signals.' },
      { name: 'X-Band Microwave Waveguide Components Kit', spec: 'WR-90 Directional Couplers, Tees, and Variable Attenuators', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 6, availableQuantity: 6, description: 'Flanged brass waveguide set including Magic Tees, E-Plane Bends, and matched loads.' },
      { name: 'Phase-Locked Loop (PLL) Circuit Kit', spec: 'CD4046 CMOS Micropower PLL Trainer Board', category: 'Module', usageType: 'Takeaway Borrowable', maxLoanDurationDays: 7, totalQuantity: 20, availableQuantity: 20, description: 'Demonstrates phase detection, VCO frequency synthesis, and carrier frequency acquisition.' },
      { name: 'Time & Frequency Division Multiplexing (TDM/FDM)', spec: 'Multi-Channel Analog/Digital Multiplexer Trainer', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 8, availableQuantity: 8, description: 'Demonstrates sharing single transmission media across multiple audio signal channels.' },
      { name: 'High-Frequency Oscilloscope (>500 MHz)', spec: 'Keysight InfiniiVision 500MHz 4-CH (DSOX3054T)', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 4, availableQuantity: 4, description: '500MHz bandwidth oscilloscope capable of capturing rapid RF transits and digital harmonics.' },
      { name: 'RF Power Meter with Coaxial Sensor', spec: 'Mini-Circuits PWR-6G+ USB Wideband Power Sensor (1-6000MHz)', category: 'Equipment', usageType: 'Takeaway Borrowable', maxLoanDurationDays: 3, totalQuantity: 6, availableQuantity: 6, description: 'True RMS RF power detector with wide dynamic range from -30 dBm to +20 dBm.' },
      { name: 'Precision Directional RF Coupler (20dB)', spec: 'Mini-Circuits ZFDC-20-5+ (0.1 to 2000 MHz)', category: 'Tool', usageType: 'Takeaway Borrowable', maxLoanDurationDays: 3, totalQuantity: 10, availableQuantity: 10, description: 'High directivity four-port coaxial component sampling forward and reflected transmission power.' },
      { name: 'Variable Coaxial RF Attenuator (0-110dB)', spec: 'Kay Elemetrics 50Ω Step Attenuator (10dB & 1dB steps)', category: 'Equipment', usageType: 'Takeaway Borrowable', maxLoanDurationDays: 3, totalQuantity: 8, availableQuantity: 8, description: 'Rotary dial precision RF attenuator for receiver sensitivity and overload testing.' },
      { name: 'Microwave Slotted Line Carriage', spec: 'X-Band Slotted Section with Tunable Crystal Detector Probe', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 4, availableQuantity: 4, description: 'Precision mechanical carriage for probing electric field standing waves inside WR-90 guides.' },
      { name: 'S-Parameter Calibration Kit (50Ω SMA)', spec: 'Open, Short, Load (OSL) Precision Calibration Standards', category: 'Tool', usageType: 'Takeaway Borrowable', maxLoanDurationDays: 3, totalQuantity: 10, availableQuantity: 10, description: 'Precision SMA calibration kit ensuring accurate VNA reference plane normalization.' },
      { name: 'RF Dummy Load (50Ω 100W)', spec: 'DC-3GHz High-Power Coaxial Termination with N-Connector', category: 'Tool', usageType: 'Takeaway Borrowable', maxLoanDurationDays: 3, totalQuantity: 8, availableQuantity: 8, description: 'Non-inductive resistor load dissipating transmitter power safely during frequency alignment.' },
      { name: 'Satellite Communication Link Simulator', spec: 'Uplink & Downlink Transponder Bench (C-Band / Ku-Band)', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 2, availableQuantity: 2, description: 'Simulates satellite delay latency, Doppler frequency shift, and path attenuation.' },
      { name: 'Radar Training System & Target Simulator', spec: 'CW Doppler & FMCW Radar Measurement Bench (10 GHz)', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 1, availableQuantity: 1, description: 'Demonstrates target velocity detection, moving target indication (MTI), and radar cross-section.' },
      { name: 'Low-Distortion Audio Signal Generator', spec: 'Leader LAG-120B Audio Generator (10Hz to 1MHz)', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 8, availableQuantity: 8, description: 'Clean low-THD sine and square generator for audio amplifier bandwidth evaluation.' },
      { name: 'Telephony & DTMF Signaling Trainer', spec: 'PSTN Line Simulator with Dual-Tone Multi-Frequency Decoder', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 6, availableQuantity: 6, description: 'Demonstrates phone ring voltage generation, loop current sensing, and telephone exchange logic.' },
      { name: 'Low-Noise RF Amplifier (LNA)', spec: '0.1-4GHz 20dB Gain with NF 0.6dB (Bias-Tee Powered)', category: 'Module', usageType: 'Takeaway Borrowable', maxLoanDurationDays: 3, totalQuantity: 12, availableQuantity: 12, description: 'Broadband low-noise amplifier module boosting weak antenna signals before SDR demodulation.' },
      { name: 'Impedance Matching Stub Tuner', spec: 'Double-Stub Coaxial Matching Tuner (50Ω SMA, 1-3 GHz)', category: 'Tool', usageType: 'Takeaway Borrowable', maxLoanDurationDays: 3, totalQuantity: 6, availableQuantity: 6, description: 'Dual sliding stub coaxial tuner cancelling load reactance and matching complex RF loads.' }
    ]
  },

  // =========================================================================
  // 5. High Performance Computer Laboratory
  // =========================================================================
  {
    lab: 'High Performance Computer Laboratory',
    items: [
      { name: 'Supercomputer Compute Cluster Node', spec: 'HPE ProLiant DL385 Gen11 (2x AMD EPYC 9654 96-Core, 512GB)', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 8, availableQuantity: 8, description: 'High-density multi-core compute node dedicated to MPI parallel processing workloads.' },
      { name: 'Enterprise Data Center GPU Accelerator', spec: 'NVIDIA H100 80GB SXM5 Tensor Core Accelerator', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 4, availableQuantity: 4, description: 'Ultra-fast transformer engine GPU for distributed deep learning and scientific simulations.' },
      { name: 'High-Density 1U Cluster Server', spec: 'Supermicro SuperServer 1029P-WTR (Dual Xeon Scalable)', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 10, availableQuantity: 10, description: 'Compact 1U rack server providing distributed computing nodes for OpenMP and Slurm jobs.' },
      { name: 'InfiniBand High-Speed Switch', spec: 'NVIDIA Quantum-2 QM9700 64-Port HDR/NDR (400Gb/s)', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 2, availableQuantity: 2, description: 'Sub-microsecond ultra-low latency InfiniBand switch interconnecting HPC compute nodes.' },
      { name: 'InfiniBand Host Channel Adapter (HCA)', spec: 'NVIDIA ConnectX-7 Single-Port NDR 400Gb/s PCIe x16', category: 'Active Component', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 16, availableQuantity: 16, description: 'PCI Express network adapter delivering direct memory access (RDMA) across cluster nodes.' },
      { name: '100G Ethernet Aggregation Switch', spec: 'Cisco Nexus 9336C-FX2 36-Port 40/100G QSFP28', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 2, availableQuantity: 2, description: 'High-throughput spine-leaf switch for cluster management and distributed storage traffic.' },
      { name: 'Storage Area Network (SAN) Enclosure', spec: 'Dell PowerVault ME5024 (24x 1.92TB NVMe SSDs)', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 2, availableQuantity: 2, description: 'High-IOPS dual-controller SAN delivering block storage over Fibre Channel and iSCSI.' },
      { name: 'Parallel File System Server (Lustre/ZFS)', spec: '4U 36-Bay Storage Server with 36x 16TB Enterprise SAS', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 2, availableQuantity: 2, description: 'High-throughput shared POSIX file system server for concurrent multi-node checkpointing.' },
      { name: 'Enterprise NVMe RAID Controller', spec: 'Broadcom MegaRAID 9660-16i PCIe 4.0 Tri-Mode Controller', category: 'Active Component', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 6, availableQuantity: 6, description: 'Hardware RAID controller offloading parity calculations for high-availability arrays.' },
      { name: 'Registered ECC DDR5 Server Memory (64GB)', spec: '64GB 2Rx4 PC5-4800B-R DDR5 RDIMM 288-Pin', category: 'Active Component', usageType: 'Takeaway Borrowable', maxLoanDurationDays: 3, totalQuantity: 32, availableQuantity: 32, description: 'High-reliability server RAM with on-die Error-Correcting Code preventing bit-flip crashes.' },
      { name: 'Redundant Titanium Server Power Supply (1600W)', spec: 'Delta 1600W 80 PLUS Titanium Hot-Plug PSU (96% Eff.)', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 8, availableQuantity: 8, description: 'High-efficiency hot-swappable power supply for critical HPC cluster nodes.' },
      { name: 'Data Center Modular Three-Phase UPS', spec: 'Schneider Electric Galaxy VS 20kVA 400V UPS System', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 1, availableQuantity: 1, description: 'Centralized uninterruptible power system protecting laboratory supercomputing racks.' },
      { name: 'Precision In-Row Cooling Air Handler', spec: 'Vertiv Liebert CRV In-Row Precision Cooling (35kW)', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 2, availableQuantity: 2, description: 'Close-coupled server row air conditioner maintaining optimal intake temperatures.' },
      { name: 'Heavy-Duty 48U Server Enclosure Rack', spec: 'APC NetShelter SX 48U 600mm x 1075mm Deep Rack', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 4, availableQuantity: 4, description: 'Heavy-duty steel server cabinet supporting up to 1500kg of dense compute equipment.' },
      { name: 'KVM-Over-IP Remote Access Switch (16-Port)', spec: 'Raritan Dominion KX III (DKX3-116) Virtual Media', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 2, availableQuantity: 2, description: 'BIOS-level IP remote management switch allowing complete remote cluster installation.' },
      { name: 'Out-of-Band Management Controller Router', spec: 'Cisco Catalyst 1000 24-Port Dedicated OOB Switch', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 2, availableQuantity: 2, description: 'Isolated network infrastructure dedicated exclusively to IPMI, iDRAC, and iLO interfaces.' },
      { name: '100G QSFP28 Direct Attach Copper Cable (DAC)', spec: '100GbE QSFP28 to QSFP28 Passive Twinax (2m)', category: 'Tool', usageType: 'Takeaway Borrowable', maxLoanDurationDays: 3, totalQuantity: 24, availableQuantity: 24, description: 'Ultra-low latency twinaxial copper cable interconnecting servers to top-of-rack switches.' },
      { name: 'Overhead Fiber Optic Pathway Ducting Set', spec: 'Panduit FiberRunner 4x4-inch Overhead Yellow Trough', category: 'Tool', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 6, availableQuantity: 6, description: 'Overhead cable routing system protecting fragile high-speed fiber patch cables.' },
      { name: 'Environmental Server Room Monitor (IP)', spec: 'Sensaphone IMS-1000 Environmental Server Monitor', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 2, availableQuantity: 2, description: 'Automated monitoring unit alerting via SMS on temperature rise, water leaks, and power failure.' },
      { name: 'Clean Agent Fire Suppression System (FM-200)', spec: 'Kidde Novec 1230 / FM-200 Automated Cylinder System', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 1, availableQuantity: 1, description: 'Waterless gaseous fire extinguisher protecting sensitive electronic server arrays.' },
      { name: 'Monitored 3-Phase Zero-U Vertical PDU', spec: 'Eaton ePDU G3 Managed 32A 3-Phase 400V (24x C13, 6x C19)', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 6, availableQuantity: 6, description: 'Vertical cabinet PDU measuring power factor, kilowatt-hours, and individual branch amperage.' },
      { name: 'Automated LTO Tape Backup Library (24-Slot)', spec: 'Quantum SuperLoader 3 (LTO-9 SAS Tape Autoloader 432TB)', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 1, availableQuantity: 1, description: 'Automated tape drive for air-gapped cold storage and disaster recovery archiving.' },
      { name: 'Dual-Port 25G SFP28 PCIe Network Adapter', spec: 'Broadcom NetXtreme-E BCM57414 Dual-Port 25G OCP 3.0', category: 'Active Component', usageType: 'Takeaway Borrowable', maxLoanDurationDays: 3, totalQuantity: 12, availableQuantity: 12, description: 'High-throughput PCIe adapter with RoCE v2 (RDMA over Converged Ethernet) hardware acceleration.' },
      { name: 'Secure Serial Console Server Router (16-Port)', spec: 'Opengear IM7216-2-DAC Infrastructure Manager', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 2, availableQuantity: 2, description: 'Out-of-band console server providing remote command-line access via cellular 4G failover.' },
      { name: 'Biometric Server Cabinet Access Lock', spec: 'Southco Electronic Swinghandle with Fingerprint Scanner', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 4, availableQuantity: 4, description: 'Access control handle recording audit trails of authorized student server access.' },
      { name: 'Mobile Server Rack Crash Cart', spec: 'Ergotron Mobile Crash Cart with 19-inch Monitor & Keyboard', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 2, availableQuantity: 2, description: 'Wheeled cart enabling on-site emergency physical console troubleshooting in server aisles.' },
      { name: 'Hardware Server Load Balancer', spec: 'Kemp LoadMaster LM-X15 Hardware Load Balancer (15Gbps)', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 2, availableQuantity: 2, description: 'Balances computational client requests across multiple web and API backend servers.' },
      { name: 'Gigabit Network Test Access Point (TAP)', spec: 'ProConsult Fiber Optical LC TAP (50/50 Split Ratio)', category: 'Tool', usageType: 'Takeaway Borrowable', maxLoanDurationDays: 3, totalQuantity: 6, availableQuantity: 6, description: 'Passive optical tap copying 100% of network packets to security intrusion monitoring systems.' },
      { name: 'High-Performance Liquid-Cooled CPU Workstation', spec: 'AMD Threadripper 7980X (64 Cores / 128 Threads, 128GB)', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 6, availableQuantity: 6, description: 'Developer workstation compiling massive scientific C++/Fortran parallel codes.' },
      { name: 'Perforated Raised Floor Airflow Tiles (55%)', spec: 'Tate Airflow Heavy-Duty 600mm x 600mm Steel Tiles', category: 'Tool', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 16, availableQuantity: 16, description: 'Specially engineered high-flow tiles directing cold air plenum pressure up into server racks.' }
    ]
  },

  // =========================================================================
  // 6. Electronics and Measurements Laboratory
  // =========================================================================
  {
    lab: 'Electronics and Measurements Laboratory',
    items: [
      { name: 'Dual-Trace Analog Cathode Ray Oscilloscope (CRO)', spec: 'Good Will Instek GOS-620 20MHz 2-Channel Analog CRO', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 10, availableQuantity: 10, description: 'Classic CRT display oscilloscope for observing continuous real-time electron beam sweeps.' },
      { name: 'Digital Storage Oscilloscope with Waveform Recorder', spec: 'Tektronix TBS1052B-EDU 50MHz 2-CH 1GSa/s', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 12, availableQuantity: 12, description: 'Specialized educational oscilloscope with built-in lab courseware and FFT analysis.' },
      { name: 'Triple-Output Precision DC Bench Power Supply', spec: 'Keysight E3631A 0-6V 5A & ±25V 1A Triple Output', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 10, availableQuantity: 10, description: 'Ultra-stable linear power supply with low noise and isolation between output channels.' },
      { name: 'Arbitrary Waveform / Function Generator', spec: 'BK Precision 4053B 10MHz Dual-Channel Function Gen', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 10, availableQuantity: 10, description: 'Synthesizes clean sine, triangle, square, sweep, and user-defined arbitrary analog waveforms.' },
      { name: 'Benchtop 6.5-Digit Digital Multimeter', spec: 'Keithley DMM6500 6.5-Digit Graphical Touchscreen DMM', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 8, availableQuantity: 8, description: 'Precision benchtop multimeter measuring microvolts, nanoamps, and 4-wire Kelvin resistance.' },
      { name: 'High-Accuracy Benchtop LCR Meter', spec: 'GW Instek LCR-8210 10Hz to 10MHz Precision LCR Meter', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 6, availableQuantity: 6, description: 'Measures Q-factor, dissipation factor (D), phase angle, and complex impedance parameters.' },
      { name: 'True RMS Industrial Handheld Multimeter', spec: 'Fluke 87V Industrial Multimeter (0.05% Accuracy)', category: 'Equipment', usageType: 'Takeaway Borrowable', maxLoanDurationDays: 3, totalQuantity: 15, availableQuantity: 15, description: 'Rugged high-accuracy meter with low-pass filter for accurate measurements on VFD motor drives.' },
      { name: 'Decade Resistance Box (0.1Ω to 11.11MΩ)', spec: 'IET Labs 6-Dial Precision Decade Resistor (0.1% Acc.)', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 12, availableQuantity: 12, description: 'Calibrated rotary switch resistance box used for circuit substitution and bridge nulling.' },
      { name: 'Decade Capacitance Box (100pF to 11.11µF)', spec: 'IET Labs 5-Dial Precision Decade Capacitor (1% Acc.)', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 12, availableQuantity: 12, description: 'High-voltage film capacitor decade box for filter tuning and AC bridge balancing.' },
      { name: 'Decade Inductance Box (1mH to 11.11H)', spec: '4-Dial Variable Inductance Box (Ferrite Core, 2% Acc.)', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 8, availableQuantity: 8, description: 'Rotary decade inductor for investigating resonant LC circuits and magnetic reactance.' },
      { name: 'Wheatstone Bridge Measurement Apparatus', spec: 'Self-Contained Bridge with Galvanometer & Ratio Arms', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 8, availableQuantity: 8, description: 'Fundamental laboratory apparatus measuring unknown medium resistances (1Ω to 1MΩ).' },
      { name: 'Kelvin Double Bridge Kit for Low Resistance', spec: 'Precision Low-Resistance Bridge (0.00001Ω to 11Ω)', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 6, availableQuantity: 6, description: 'Eliminates contact and lead wire resistance when measuring heavy cables and shunt resistors.' },
      { name: 'Schering & Maxwell AC Bridge Training Apparatus', spec: 'Universal AC Impedance Bridge Kit with 1kHz Oscillator', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 6, availableQuantity: 6, description: 'Measures dielectric loss in capacitors and self-inductance in terms of standard capacitance.' },
      { name: 'High-Sensitivity Moving Coil Galvanometer', spec: 'Spot-Reflecting Galvanometer (Sensitivity 10^-9 A/div)', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 10, availableQuantity: 10, description: 'Highly sensitive null-balance detector for Wheatstone and potentiometer experiments.' },
      { name: 'Analog Dynamometer Wattmeter', spec: 'Yokogawa 2041 Low Power Factor Single-Phase Wattmeter', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 8, availableQuantity: 8, description: 'Electrodynamic instrument measuring active AC power with current and voltage potential coils.' },
      { name: 'Precision Current Transformer (CT Ratio 50/5A)', spec: 'Class 0.2 Measuring Current Transformer', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 6, availableQuantity: 6, description: 'Steps down high alternating currents to standard 5A ammeter levels for measurement training.' },
      { name: 'Precision Potential Transformer (PT Ratio 440/110V)', spec: 'Class 0.2 Indoor Voltage Transformer (50VA)', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 6, availableQuantity: 6, description: 'Steps down line AC voltages to safe 110V levels for voltmeter and wattmeter circuits.' },
      { name: 'Transistor Characteristic Curve Tracer', spec: 'Tektronix 576 Classic High-Power Curve Tracer Unit', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 2, availableQuantity: 2, description: 'Displays Vce vs Ic family curves of bipolar transistors, JFETs, and diodes on screen.' },
      { name: 'Programmable Electronic DC Load', spec: 'Rigol DL3021 150V 40A 200W Electronic Load', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 6, availableQuantity: 6, description: 'Simulates constant current (CC), constant resistance (CR), and battery discharge tests.' },
      { name: 'Hall Effect Digital Gaussmeter / Teslameter', spec: 'Lake Shore 410 Handheld Magnetic Field Gaussmeter', category: 'Equipment', usageType: 'Takeaway Borrowable', maxLoanDurationDays: 3, totalQuantity: 4, availableQuantity: 4, description: 'Measures DC and AC magnetic flux densities with transverse and axial Hall effect probes.' },
      { name: 'Strain Gauge Measurement & Conditioning Trainer', spec: 'Full, Half & Quarter Bridge Cantilever Beam Trainer', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 6, availableQuantity: 6, description: 'Investigates piezoresistive foil strain gauges, gauge factor, and instrumentation amplifiers.' },
      { name: 'LVDT Displacement Transducer Trainer', spec: 'Linear Variable Differential Transformer (±10mm Range)', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 6, availableQuantity: 6, description: 'Demonstrates inductive position sensing with phase-sensitive demodulator output.' },
      { name: 'Thermocouple and RTD Temperature Measurement Kit', spec: 'PT100 RTD & Type-K Thermocouple Temperature Calibration Bath', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 6, availableQuantity: 6, description: 'Investigates temperature coefficient of resistance (Callendar-Van Dusen) and Seebeck voltage.' },
      { name: 'Universal Frequency Counter / Timer', spec: 'Pendulum / Fluke CNT-90 350MHz Frequency Counter (12-Digit)', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 6, availableQuantity: 6, description: 'Measures frequency, period, time interval, phase, and duty cycles with ultra-high resolution.' },
      { name: 'Digital Phase Angle Meter (0 to 360°)', spec: 'Dual-Channel Voltage/Current Phase Meter (50/60Hz)', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 4, availableQuantity: 4, description: 'Measures phase shifts between voltages and currents in complex RLC network circuits.' },
      { name: 'Digital IC Tester (7400/4000/SRAM Series)', spec: 'BK Precision 570A Handheld Digital IC Tester', category: 'Tool', usageType: 'Takeaway Borrowable', maxLoanDurationDays: 3, totalQuantity: 6, availableQuantity: 6, description: 'Identifies and checks logic truth tables of TTL, CMOS, and static RAM chips automatically.' },
      { name: 'Digital Lux / Illuminance Light Meter', spec: 'Extech LT300 Handheld Lux Meter (0 to 200,000 Lux)', category: 'Tool', usageType: 'Takeaway Borrowable', maxLoanDurationDays: 3, totalQuantity: 8, availableQuantity: 8, description: 'Measures worktable and environmental light intensity using cosine-corrected photodiode.' },
      { name: 'Precision 10-Turn Wirewound Potentiometer', spec: 'Bourns 3590S Precision 10kΩ Potentiometer with Counting Dial', category: 'Tool', usageType: 'Takeaway Borrowable', maxLoanDurationDays: 7, totalQuantity: 20, availableQuantity: 20, description: 'Precision potentiometer with turn-counting locking dial for calibrated voltage dividers.' },
      { name: 'Digital Sound Level Meter (Decibel Meter)', spec: 'Type 2 Sound Meter (30-130 dB Range, A/C Weighting)', category: 'Tool', usageType: 'Takeaway Borrowable', maxLoanDurationDays: 3, totalQuantity: 6, availableQuantity: 6, description: 'Measures acoustic noise levels in electronic and mechanical test environments.' },
      { name: 'Handheld Insulation Resistance Tester (Megger 1000V)', spec: 'Fluke 1507 1000V Digital Insulation Resistance Tester', category: 'Equipment', usageType: 'Takeaway Borrowable', maxLoanDurationDays: 3, totalQuantity: 6, availableQuantity: 6, description: 'Tests insulation dielectric breakdown on circuit boards, cables, and small motor windings.' }
    ]
  },

  // =========================================================================
  // 7. High Voltage and Renewable Energy Laboratory
  // =========================================================================
  {
    lab: 'High Voltage and Renewable Energy Laboratory',
    items: [
      { name: 'High Voltage AC Test Transformer (100kV)', spec: '100kV 5kVA Dry-Type Partial Discharge Free Test Unit', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 1, availableQuantity: 1, description: 'High-voltage generation unit inside safety interlocked cage for dielectric withstand tests.' },
      { name: 'High Voltage DC Power Supply (80kV)', spec: 'Glassman / Spellman 80kV 10mA High Voltage DC Supply', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 2, availableQuantity: 2, description: 'Regulated high voltage direct current supply for electrostatic and cable leakage testing.' },
      { name: 'Multi-Stage Marx Impulse Voltage Generator', spec: '300kV 3-Stage Lightning Impulse Generator (1.2/50µs)', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 1, availableQuantity: 1, description: 'Generates standard lightning impulse waveforms for insulator sparkover flashover tests.' },
      { name: 'Standard Sphere Gap Breakdown Apparatus', spec: '100mm Diameter Copper Sphere Gap with Micrometer Drive', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 2, availableQuantity: 2, description: 'Standard air gap sparkover breakdown voltage reference calibrated according to IEC 60052.' },
      { name: 'HV Capacitive & Resistive Voltage Dividers', spec: '100kV 1000:1 Precision Ratio High Voltage Divider', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 3, availableQuantity: 3, description: 'Attenuates high voltages to safe 100V oscilloscope levels with matched phase compensation.' },
      { name: 'Partial Discharge (PD) Detection System', spec: 'Omicron MPD 600 Modular Partial Discharge Detector', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 1, availableQuantity: 1, description: 'Ultra-sensitive measurement device detecting picocoulomb (pC) level internal insulation voids.' },
      { name: 'Transformer Oil Dielectric Strength Breakdown Kit', spec: 'Automated 80kV Oil Vessel Breakdown Tester (IEC 60156)', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 2, availableQuantity: 2, description: 'Applies motor-driven ramp voltage across mushroom electrodes immersed in insulating oil.' },
      { name: 'High Voltage Insulation Tester (5000V Megger)', spec: 'Megger MIT515 5kV Insulation Resistance Tester (10 TΩ)', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 3, availableQuantity: 3, description: 'Conducts Polarization Index (PI) and Dielectric Absorption Ratio (DAR) on heavy gear.' },
      { name: 'Digital Earth Ground Resistance Clamp Tester', spec: 'Fluke 1625-2 GEO Earth Ground Tester Kit (4-Pole Stakeless)', category: 'Equipment', usageType: 'Takeaway Borrowable', maxLoanDurationDays: 3, totalQuantity: 4, availableQuantity: 4, description: 'Measures soil resistivity and grounding electrode resistance in outdoor electrical grids.' },
      { name: 'Monocrystalline Solar PV Training Simulator', spec: '400W Mobile Dual-Panel Photovoltaic Test Trolley', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 4, availableQuantity: 4, description: 'Tilting panel array with current/voltage monitoring for tracing solar I-V and P-V curves.' },
      { name: 'Indoor Halogen Solar Radiation Simulator', spec: '1000W/m² Calibrated Halogen Lamp Array with Dimming', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 2, availableQuantity: 2, description: 'Emulates natural solar irradiance inside the laboratory under controlled temperatures.' },
      { name: 'Wind Turbine Emulator Test Bench', spec: '1.5kW DC Motor Driving Permanent Magnet Generator (PMSG)', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 2, availableQuantity: 2, description: 'Emulates aerodynamic rotor torque and wind velocity fluctuations under computer control.' },
      { name: 'Maximum Power Point Tracking (MPPT) Controller', spec: 'Victron SmartSolar MPPT 150/35 (12/24/48V Auto)', category: 'Module', usageType: 'Takeaway Borrowable', maxLoanDurationDays: 7, totalQuantity: 6, availableQuantity: 6, description: 'Ultrafast MPPT charge controller demonstrating Perturb & Observe (P&O) tracking.' },
      { name: 'Grid-Tied Photovoltaic Inverter Trainer', spec: 'Enphase IQ7 Microinverter & 1kW Single-Phase Grid Tie', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 3, availableQuantity: 3, description: 'Inverts DC solar energy into 230V AC synchronized with university power grid frequency.' },
      { name: 'Pure Sine Wave Off-Grid Inverter (2kW)', spec: 'Victron MultiPlus 24/2000/50 Inverter-Charger', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 3, availableQuantity: 3, description: 'Standalone solar inverter with battery charger and high surge capacity for inductive loads.' },
      { name: 'Deep-Cycle Solar Battery Bank (LiFePO4 & Gel)', spec: '24V 100Ah Lithium Iron Phosphate Battery with Smart BMS', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 4, availableQuantity: 4, description: 'Energy storage bank demonstrating state-of-charge (SoC), C-rates, and cell balancing.' },
      { name: 'PEM Hydrogen Fuel Cell Training System', spec: 'Horizon 30W Proton Exchange Membrane Fuel Cell Kit', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 2, availableQuantity: 2, description: 'Converts hydrogen and oxygen into electricity and pure water; plots polarization curves.' },
      { name: 'PEM Water Electrolyzer Hydrogen Generator', spec: 'Solar-Powered Electrolyzer (30W, Deionized Water)', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 2, availableQuantity: 2, description: 'Produces clean green hydrogen fuel using electricity generated from photovoltaic cells.' },
      { name: '3-Phase Power Quality Analyzer', spec: 'Fluke 435 Series II Three-Phase Power Quality Analyzer', category: 'Equipment', usageType: 'Takeaway Borrowable', maxLoanDurationDays: 3, totalQuantity: 3, availableQuantity: 3, description: 'Captures voltage dips, sags, harmonics (THD up to 50th), transients, and flicker.' },
      { name: 'Corona Discharge High Voltage Visualizer', spec: 'CoroCam / UV Sensitive Dark-Box Chamber (up to 50kV)', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 1, availableQuantity: 1, description: 'Observes ionization of surrounding air and audible hiss along thin conductor strands.' },
      { name: 'Porcelain and Polymer Insulator / Bushing Models', spec: '11kV/33kV Pin, Suspension, and Post Insulators Set', category: 'Tool', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 8, availableQuantity: 8, description: 'Tests creepage distance, dry flashover, wet rain flashover, and pollution mapping.' },
      { name: 'Gas-Filled Standard High Voltage Capacitor', spec: '100kV SF6 / Nitrogen Gas-Insulated Reference Capacitor', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 2, availableQuantity: 2, description: 'Loss-free reference standard for Schering bridge loss factor (tan delta) measurements.' },
      { name: 'Precision Solar Pyranometer', spec: 'Kipp & Zonen CMP3 Secondary Standard Pyranometer', category: 'Sensor', usageType: 'Takeaway Borrowable', maxLoanDurationDays: 3, totalQuantity: 4, availableQuantity: 4, description: 'Thermopile solar sensor measuring hemispherical solar radiation in Watts per square meter.' },
      { name: 'Ultrasonic Cup Anemometer (Wind Speed Sensor)', spec: '0-50 m/s Anemometer with Direction Vane (RS485 Modbus)', category: 'Sensor', usageType: 'Takeaway Borrowable', maxLoanDurationDays: 3, totalQuantity: 6, availableQuantity: 6, description: 'Industrial wind speed and direction gauge for wind turbine cut-in/cut-out analysis.' },
      { name: 'Pelton Wheel Micro-Hydro Power Simulator', spec: 'Closed-Loop Water Turbine with Centrifugal Pump (500W)', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 1, availableQuantity: 1, description: 'Demonstrates hydro-power generation, water flow rate, nozzle control, and efficiency.' },
      { name: 'Smart Grid Bidirectional Energy Metering Trainer', spec: 'Three-Phase 4-Quadrant Smart Meter with Modbus RTU', category: 'Module', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 6, availableQuantity: 6, description: 'Measures net import/export power and time-of-use tariffs for smart renewable microgrids.' },
      { name: 'High-Power Synchronous DC-DC Buck-Boost Converter', spec: '1kW 10-60V Bidirectional Converter (MPPT/Battery)', category: 'Module', usageType: 'Takeaway Borrowable', maxLoanDurationDays: 7, totalQuantity: 6, availableQuantity: 6, description: 'High-power MOSFET switching converter for renewable energy bus regulation.' },
      { name: 'Metal-Oxide Surge Arrester (MOV / Lightning Arrester)', spec: '11kV Station Class Zinc Oxide (ZnO) Gapless Arrester', category: 'Tool', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 6, availableQuantity: 6, description: 'Protective apparatus clamping lightning and switching overvoltage surges to ground.' },
      { name: 'Arc Flash PPE Kit & Telescopic Hot Stick', spec: '40 cal/cm² Arc Flash Suit, Hood, and 100kV Fiberglass Stick', category: 'Tool', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 3, availableQuantity: 3, description: 'Personal safety protection equipment mandatory during high voltage testing and earthing.' },
      { name: 'Faraday Shielding Mesh Cage with Safety Interlocks', spec: 'Galvanized Steel Grounded Mesh Enclosure (3m x 3m x 2.5m)', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 1, availableQuantity: 1, description: 'Electromagnetic shielding cage containing high voltage discharges safely inside.' }
    ]
  },

  // =========================================================================
  // 8. Electric Machines and Power Systems Laboratory
  // =========================================================================
  {
    lab: 'Electric Machines and Power Systems Laboratory',
    items: [
      { name: 'DC Shunt Motor (1.5kW 220V)', spec: '1500 RPM Separately Excited / Shunt Wound DC Motor', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 4, availableQuantity: 4, description: 'Heavy duty DC motor for studying field flux control, armature resistance control, and speed regulation.' },
      { name: 'DC Series & Compound Motor (1.5kW)', spec: 'Universal Wound DC Series Motor with Commutating Poles', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 4, availableQuantity: 4, description: 'Investigates high starting torque characteristics and cumulative/differential compounding.' },
      { name: '3-Phase Squirrel Cage Induction Motor', spec: '2.2kW 4-Pole 400V 50Hz TEFC Induction Motor (1440 RPM)', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 6, availableQuantity: 6, description: 'Industrial workhorse motor for conducting no-load tests, blocked-rotor tests, and circle diagrams.' },
      { name: '3-Phase Slip Ring (Wound Rotor) Induction Motor', spec: '2.2kW Wound Rotor Motor with External Rotor Rheostat', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 4, availableQuantity: 4, description: 'Allows inserting external resistance into the rotor circuit for starting torque optimization.' },
      { name: 'Single-Phase Capacitor-Start Induction Motor', spec: '0.75kW 230V with Centrifugal Switch and Start Capacitor', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 4, availableQuantity: 4, description: 'Standard domestic motor for investigating split-phase starting and forward/reverse rotation.' },
      { name: '3-Phase Salient Pole Synchronous Alternator', spec: '3kVA 400V 1500 RPM 4-Pole Brushless Alternator', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 4, availableQuantity: 4, description: 'Generates 3-phase electricity; plots open-circuit (OCC) and short-circuit (SCC) saturation curves.' },
      { name: '3-Phase Synchronous Motor with Damper Windings', spec: '2.2kW 400V Synchronous Motor with DC Exciter', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 3, availableQuantity: 3, description: 'Investigates V-curves and inverted V-curves demonstrating leading power factor correction.' },
      { name: 'Universal AC/DC Commutator Motor', spec: '0.5kW 230V Series Wound Motor (High Speed up to 10,000 RPM)', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 4, availableQuantity: 4, description: 'Small electric appliance motor operating on both alternating and direct current supplies.' },
      { name: 'Fractional Horsepower (FHP) Motor Demonstration Kit', spec: 'Shaded Pole, Permanent Split Capacitor & Stepper Motors', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 6, availableQuantity: 6, description: 'Compact bench demonstration unit showing internal magnetic flux distributions of small motors.' },
      { name: 'Motor-Generator (MG) Coupling Test Set', spec: 'DC Motor Coupled to 3-Phase Alternator on Common Bedplate', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 4, availableQuantity: 4, description: 'Electromechanical set for loading generators and evaluating system conversion efficiencies.' },
      { name: 'Eddy Current Brake Dynamometer', spec: 'Air-Cooled Electromagnetic Eddy Current Dynamometer (5kW)', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 4, availableQuantity: 4, description: 'Precision torque loading device with digital load cell for measuring motor mechanical output power.' },
      { name: 'Magnetic Powder Brake Torque Tester', spec: 'Precision Controlled Brake (0-50 Nm Continuous Torque)', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 2, availableQuantity: 2, description: 'Provides smooth, static-friction-free mechanical braking down to zero shaft rotation speed.' },
      { name: 'Variable Frequency Drive (VFD / Inverter)', spec: 'ABB ACS355 2.2kW 3-Phase Sensorless Vector VFD', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 6, availableQuantity: 6, description: 'Solid-state AC drive implementing V/f control, soft starting, and regenerative braking.' },
      { name: 'Single-Phase Testing Transformer (230V/115V 1kVA)', spec: 'Multi-Tap Low-Loss Isolation Transformer', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 8, availableQuantity: 8, description: 'Used for open-circuit core loss and short-circuit copper loss transformer tests.' },
      { name: '3-Phase Three-Limb Distribution Transformer', spec: '3kVA 400V/230V Dyn11 Core-Type Transformer', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 4, availableQuantity: 4, description: 'Demonstrates Delta-Star, Star-Delta, and Scott connection transformer phase shifts.' },
      { name: '3-Phase Variable Auto-Transformer (Variac)', spec: '0-450V 10A Continuous Rotary Three-Phase Variac', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 8, availableQuantity: 8, description: 'Provides continuously adjustable AC supply voltage from 0 to 110% of input line voltage.' },
      { name: 'Transmission Line Artificial Network Model', spec: '3-Phase π-Model & T-Model Simulator (200km 132kV Equivalent)', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 3, availableQuantity: 3, description: 'Demonstrates Ferranti effect, sending/receiving end voltage regulation, and reactive power compensation.' },
      { name: 'Protective Relay Test Kit (Current & Voltage Injection)', spec: 'Omicron CMC 356 Secondary Injection Relay Test Set', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 1, availableQuantity: 1, description: 'Injects precision current/voltage fault waveforms to test protective relay trip timing.' },
      { name: 'Digital Overcurrent & Earth Fault Relay', spec: 'Schneider MiCOM P122 Numerical Overcurrent Relay', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 4, availableQuantity: 4, description: 'Microprocessor-based relay implementing standard IEC IDMT tripping curves.' },
      { name: 'Numerical Distance Protection Relay', spec: 'Siemens SIPROTEC 7SA86 Distance Protection Unit', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 2, availableQuantity: 2, description: 'Calculates transmission line impedance zones (Zone 1, 2, 3) to clear transmission line faults.' },
      { name: 'Alternator Dark-Lamp Synchronizing Panel', spec: 'Synchroscope, 3-Lamp Dark/Bright System & Voltmeter Pair', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 3, availableQuantity: 3, description: 'Enables safe paralleling of an alternator to infinite busbars when frequency and phase match.' },
      { name: 'Digital Laser / Optical Non-Contact Tachometer', spec: 'RPM Range 2.5 to 99,999 RPM with Reflective Tape', category: 'Tool', usageType: 'Takeaway Borrowable', maxLoanDurationDays: 3, totalQuantity: 10, availableQuantity: 10, description: 'Optical laser meter measuring rotating shaft speeds safely from a distance.' },
      { name: '3-Phase Variable Resistive Load Bank (5kW)', spec: 'Wired with Switched Steps of 100W, 200W, 500W per Phase', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 4, availableQuantity: 4, description: 'Pure resistive heating element load for loading generators and transformers at unity power factor.' },
      { name: '3-Phase Variable Inductive Load Bank (3kVAR)', spec: 'Switched Iron-Core Inductors with Variable Air Gaps', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 4, availableQuantity: 4, description: 'Provides lagging reactive power load for simulating industrial induction motor loads.' },
      { name: '3-Phase Variable Capacitive Load Bank (3kVAR)', spec: 'Switched Power Factor Correction Capacitor Bank', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 4, availableQuantity: 4, description: 'Provides leading reactive power to study power factor improvement and voltage boosting.' },
      { name: 'Direct-on-Line (DOL) and Star-Delta Starter Panel', spec: 'Contactor-Based Automatic Star-Delta Starter with Timer', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 4, availableQuantity: 4, description: 'Demonstrates reducing inrush starting current in heavy 3-phase induction motors.' },
      { name: 'True RMS AC/DC Clamp-on Ammeter (600A)', spec: 'Fluke 376 FC Clamp Meter with iFlex Flexible Probe (2500A)', category: 'Equipment', usageType: 'Takeaway Borrowable', maxLoanDurationDays: 3, totalQuantity: 8, availableQuantity: 8, description: 'Clamps around thick motor feed cables to measure live currents without breaking circuits.' },
      { name: 'Digital Phase Sequence Indicator', spec: 'Rotary Disk / LED Phase Rotation Tester (90-600V)', category: 'Tool', usageType: 'Takeaway Borrowable', maxLoanDurationDays: 3, totalQuantity: 8, availableQuantity: 8, description: 'Identifies clockwise (RYB) vs counter-clockwise phase sequence before connecting motors.' },
      { name: 'Digital Power Factor Meter (0.2 Lag to 0.2 Lead)', spec: 'Yokogawa Benchtop Direct Reading Digital PF Meter', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 6, availableQuantity: 6, description: 'Displays instantaneous cosine phi of single-phase and balanced three-phase circuits.' },
      { name: 'Power System SCADA Control Interface Panel', spec: 'PLC & HMI Touchscreen Supervisory Control Simulator', category: 'Equipment', usageType: 'Lab-Reference Only', maxLoanDurationDays: 1, totalQuantity: 2, availableQuantity: 2, description: 'Simulates automated substation breaker switching, tele-metering, and load shedding alarms.' }
    ]
  }
];

// Execute Seeding
async function seedAllComponents() {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected successfully.');

    // Wipe previous components and items to ensure clean data
    await Component.deleteMany({});
    await Item.deleteMany({});
    console.log('Cleared existing Component and Item collections.');

    let globalCounter = 1;
    const componentsToInsert = [];
    const itemsToInsert = [];

    labComponentsData.forEach((labGroup) => {
      const labName = labGroup.lab;

      labGroup.items.forEach((item, index) => {
        // Location is strictly Worktable 1 to Worktable 12
        const location = getWorktable(index);

        // Clean unique ID
        const prefix = labName
          .split(' ')
          .map((w) => w[0])
          .join('')
          .toUpperCase();
        const compId = `${prefix}-${String(globalCounter).padStart(3, '0')}`;

        const compDoc = {
          compId,
          name: item.name,
          spec: item.spec,
          type: item.category,
          category: item.category,
          lab: labName,
          location,
          shelfLoc: location, // maintain compatibility with shelfLoc
          totalQuantity: item.totalQuantity,
          availableQuantity: item.availableQuantity,
          stockQty: item.availableQuantity, // maintain compatibility with stockQty
          usageType: item.usageType,
          maxLoanDurationDays: item.maxLoanDurationDays,
          status: 'Available',
          description: item.description
        };

        const itemDoc = {
          compId,
          name: item.name,
          category: item.category,
          spec: item.spec,
          lab: labName,
          location,
          totalQuantity: item.totalQuantity,
          availableQuantity: item.availableQuantity,
          usageType: item.usageType,
          maxLoanDurationDays: item.maxLoanDurationDays,
          status: 'Available',
          description: item.description
        };

        componentsToInsert.push(compDoc);
        itemsToInsert.push(itemDoc);
        globalCounter++;
      });
    });

    console.log(`Inserting ${componentsToInsert.length} documents into Component collection...`);
    await Component.insertMany(componentsToInsert);

    console.log(`Inserting ${itemsToInsert.length} documents into Item collection...`);
    await Item.insertMany(itemsToInsert);

    console.log('\n======================================================');
    console.log(`SUCCESS! Inserted ${componentsToInsert.length} components across 8 laboratories.`);
    console.log('All locations assigned exclusively to: Worktable 1 - Worktable 12.');
    console.log('minStockThreshold was omitted as requested.');
    console.log('Both Component and Item collections populated.');
    console.log('======================================================\n');

    // Print breakdown per laboratory
    labComponentsData.forEach((labGroup) => {
      console.log(`• ${labGroup.lab}: ${labGroup.items.length} items`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Seeding failed with error:', error);
    process.exit(1);
  }
}

seedAllComponents();
