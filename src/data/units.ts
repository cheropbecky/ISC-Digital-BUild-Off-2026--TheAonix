/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * UEAB Baraton Academic Units (Courses) Master Data
 * University of Eastern Africa, Baraton (Nandi County, Kenya)
 */

export interface AcademicUnit {
  code: string;
  name: string;
  school: string;
  department: string;
  creditHours: number;
  lecturerName: string;
  lecturerEmail: string;
  lecturerOffice: string;
  color: string;
  accentColor: string;
  description: string;
  prerequisites: string[];
}

export const ACADEMIC_UNITS: AcademicUnit[] = [
  {
    code: 'COSC 311',
    name: 'Compiler Design & Formal Automata',
    school: 'School of Science & Technology',
    department: 'Computer Science & Software Engineering',
    creditHours: 3,
    lecturerName: 'Dr. Evans Kiprop',
    lecturerEmail: 'ekiprop@ueab.ac.ke',
    lecturerOffice: 'Science Complex SC-214',
    color: '#0B2A6F',
    accentColor: '#F2B705',
    description: 'Lexical analysis, syntax analysis, context-free grammars, parsing algorithms (LL and LR), semantic analysis, intermediate representation, and runtime storage management.',
    prerequisites: ['COSC 210 Data Structures', 'MATH 201 Linear Algebra'],
  },
  {
    code: 'COSC 330',
    name: 'Advanced Database Management Systems',
    school: 'School of Science & Technology',
    department: 'Computer Science & Software Engineering',
    creditHours: 3,
    lecturerName: 'Prof. Mary Achieng',
    lecturerEmail: 'machieng@ueab.ac.ke',
    lecturerOffice: 'Library Learning Commons LLC-302',
    color: '#D97706',
    accentColor: '#FDE68A',
    description: 'Relational algebra and calculus, normalization theory (1NF to BCNF/5NF), query optimization, transaction processing, concurrency control, distributed databases, and indexing strategies.',
    prerequisites: ['COSC 225 Database Systems I'],
  },
  {
    code: 'COSC 420',
    name: 'Software Architecture & Cloud Systems',
    school: 'School of Science & Technology',
    department: 'Computer Science & Software Engineering',
    creditHours: 3,
    lecturerName: 'Eng. Dennis Cheruiyot',
    lecturerEmail: 'dcheruiyot@ueab.ac.ke',
    lecturerOffice: 'Science Complex SC-208',
    color: '#0284C7',
    accentColor: '#BAE6FD',
    description: 'Architectural styles, microservices, containerization with Docker and Kubernetes, cloud computing paradigms, distributed system reliability, and REST/gRPC API architectures.',
    prerequisites: ['COSC 315 Object-Oriented Software Design'],
  },
  {
    code: 'MATH 201',
    name: 'Linear Algebra with Vector Computation',
    school: 'School of Science & Technology',
    department: 'Mathematics & Applied Sciences',
    creditHours: 3,
    lecturerName: 'Dr. Benson Wafula',
    lecturerEmail: 'bwafula@ueab.ac.ke',
    lecturerOffice: 'Faculty Block FB-109',
    color: '#16A34A',
    accentColor: '#86EFAC',
    description: 'Systems of linear equations, matrices, determinants, vector spaces, inner product spaces, eigenvalues and eigenvectors, linear transformations, and numerical linear algebra applications.',
    prerequisites: ['MATH 120 Calculus I'],
  },
  {
    code: 'RELT 220',
    name: 'Christian Ethics & Social Responsibility',
    school: 'School of Humanities & Social Sciences',
    department: 'Theology & Religious Studies',
    creditHours: 2,
    lecturerName: 'Pastor Jonathan Bett',
    lecturerEmail: 'jbett@ueab.ac.ke',
    lecturerOffice: 'University Sanctuary Wing UCH-04',
    color: '#6366F1',
    accentColor: '#C7D2FE',
    description: 'Foundations of Christian moral philosophy, biblical ethical frameworks, contemporary moral dilemmas, stewardship of health and environment, and professional ethics in modern society.',
    prerequisites: [],
  },
  {
    code: 'ENGR 210',
    name: 'Digital Logic & Microprocessors',
    school: 'School of Science & Technology',
    department: 'Technology & Applied Engineering',
    creditHours: 4,
    lecturerName: 'Dr. Paul Mutua',
    lecturerEmail: 'pmutua@ueab.ac.ke',
    lecturerOffice: 'Polytechnic Workshop Annex PW-02',
    color: '#8B5CF6',
    accentColor: '#DDD6FE',
    description: 'Boolean algebra, logic gates, combinational and sequential circuit design, flip-flops, counters, microprocessor architecture (ARM/RISC-V), memory hierarchy, and assembly language programming.',
    prerequisites: ['PHYS 102 General Physics II'],
  },
  {
    code: 'COMM 111',
    name: 'Scholarly Writing & Academic Oratory',
    school: 'School of Humanities & Social Sciences',
    department: 'Languages & Communication',
    creditHours: 2,
    lecturerName: 'Dr. Sarah Rotich',
    lecturerEmail: 'srotich@ueab.ac.ke',
    lecturerOffice: 'Humanities Pavilion HP-112',
    color: '#EC4899',
    accentColor: '#FBCFE8',
    description: 'Academic discourse, research methodology, scholarly essay structure, literature synthesis, citation standards (APA/IEEE), debate, and technical presentation delivery.',
    prerequisites: [],
  },
  {
    code: 'NURS 215',
    name: 'Human Anatomy & Physiology II',
    school: 'School of Health Sciences',
    department: 'Nursing & Public Health',
    creditHours: 4,
    lecturerName: 'Dr. Grace Kemboi',
    lecturerEmail: 'gkemboi@ueab.ac.ke',
    lecturerOffice: 'Health Sciences Wing HSW-201',
    color: '#059669',
    accentColor: '#A7F3D0',
    description: 'Structure and physiology of the cardiovascular, respiratory, renal, digestive, and endocrine systems with dedicated clinical laboratory and simulation ward sessions.',
    prerequisites: ['NURS 110 Anatomy & Physiology I'],
  },
];
