
// Mock data for development - Will be replaced with Appwrite in production

// User types
export type UserType = 'individual' | 'school' | 'student';

export interface User {
  id: string;
  email: string;
  name: string;
  userType: UserType;
  schoolId?: string; // For students
  schoolName?: string; // For schools
  logoUrl?: string; // For schools
  isVerified?: boolean; // For schools (token verification)
}

export interface Student {
  id: string;
  schoolId: string;
  username: string;
  name: string;
  status: 'active' | 'suspended';
}

export interface Subject {
  id: string;
  name: 'Math' | 'English' | 'Science' | 'SST';
  color: string;
}

export interface Question {
  id: string;
  text: string;
  type: 'objective' | 'checkbox' | 'dragdrop' | 'text';
  options?: string[];
  correctAnswers?: string[] | string;
  subjectId: string;
}

export interface Paper {
  id: string;
  title: string;
  subjectId: string;
  questionIds: string[];
  createdBy: string;
  createdAt: Date;
}

export interface Attempt {
  id: string;
  studentId: string;
  paperId: string;
  startTime: Date;
  endTime?: Date;
  score?: number;
  answers: Record<string, string | string[]>;
}

// Mock data
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@school.com',
    name: 'Demo School',
    userType: 'school',
    schoolName: 'Demo School',
    logoUrl: '/placeholder.svg',
    isVerified: true
  },
  {
    id: '2',
    email: 'student@example.com',
    name: 'John Doe',
    userType: 'student',
    schoolId: '1'
  },
  {
    id: '3',
    email: 'individual@example.com',
    name: 'Jane Smith',
    userType: 'individual'
  }
];

const mockStudents: Student[] = [
  {
    id: '2',
    schoolId: '1',
    username: 'S001',
    name: 'John Doe',
    status: 'active'
  },
  {
    id: '4',
    schoolId: '1',
    username: 'S002',
    name: 'Alice Johnson',
    status: 'active'
  },
  {
    id: '5',
    schoolId: '1',
    username: 'S003',
    name: 'Bob Williams',
    status: 'suspended'
  }
];

const mockSubjects: Subject[] = [
  { id: '1', name: 'Math', color: '#1E88E5' },
  { id: '2', name: 'English', color: '#26A69A' },
  { id: '3', name: 'Science', color: '#66BB6A' },
  { id: '4', name: 'SST', color: '#7E57C2' }
];

const mockQuestions: Question[] = [
  {
    id: '1',
    text: 'What is 2 + 2?',
    type: 'objective',
    options: ['3', '4', '5', '6'],
    correctAnswers: ['4'],
    subjectId: '1' // Math
  },
  {
    id: '2',
    text: 'Which of the following are prime numbers?',
    type: 'checkbox',
    options: ['2', '4', '5', '9'],
    correctAnswers: ['2', '5'],
    subjectId: '1' // Math
  },
  {
    id: '3',
    text: 'Match the following equations with their solutions.',
    type: 'dragdrop',
    options: ['x + 5 = 7', '2x = 6', '3x - 9 = 0', 'x + x = 8'],
    correctAnswers: ['2', '3', '3', '4'],
    subjectId: '1' // Math
  },
  {
    id: '4',
    text: 'Define the word "Photosynthesis".',
    type: 'text',
    correctAnswers: 'The process by which green plants make their own food',
    subjectId: '3' // Science
  }
];

const mockPapers: Paper[] = [
  {
    id: '1',
    title: 'Basic Math Test',
    subjectId: '1',
    questionIds: ['1', '2', '3'],
    createdBy: '1',
    createdAt: new Date('2023-01-10')
  },
  {
    id: '2',
    title: 'Science Quiz',
    subjectId: '3',
    questionIds: ['4'],
    createdBy: '1',
    createdAt: new Date('2023-01-15')
  }
];

const mockAttempts: Attempt[] = [
  {
    id: '1',
    studentId: '2',
    paperId: '1',
    startTime: new Date('2023-01-20T09:00:00'),
    endTime: new Date('2023-01-20T10:00:00'),
    score: 80,
    answers: {
      '1': ['4'],
      '2': ['2', '5'],
      '3': ['2', '3', '3', '4']
    }
  }
];

// Mock API functions
let currentUser: User | null = null;

export const api = {
  // Auth functions
  login: async (email: string, password: string): Promise<User> => {
    // Mock login - in production, this would use Appwrite auth
    const user = mockUsers.find(u => u.email === email);
    if (!user) throw new Error('Invalid credentials');
    currentUser = user;
    return user;
    
    /* Appwrite Implementation
    try {
      const session = await account.createEmailSession(email, password);
      const user = await account.get();
      return user;
    } catch (error) {
      throw new Error('Authentication failed');
    }
    */
  },
  
  signup: async (userData: Partial<User>, password: string): Promise<User> => {
    // Mock signup - in production, this would use Appwrite auth
    const newUser: User = {
      id: String(mockUsers.length + 1),
      email: userData.email || '',
      name: userData.name || '',
      userType: userData.userType || 'individual',
      ...userData
    };
    
    mockUsers.push(newUser);
    currentUser = newUser;
    return newUser;
    
    /* Appwrite Implementation
    try {
      const user = await account.create(
        ID.unique(),
        userData.email,
        password,
        userData.name
      );
      
      // Store additional user data in a database collection
      await databases.createDocument(
        DATABASE_ID,
        USER_COLLECTION_ID,
        ID.unique(),
        {
          userId: user.$id,
          userType: userData.userType,
          schoolName: userData.schoolName,
          logoUrl: userData.logoUrl
        }
      );
      
      return user;
    } catch (error) {
      throw new Error('Registration failed');
    }
    */
  },
  
  logout: async (): Promise<void> => {
    // Mock logout
    currentUser = null;
    
    /* Appwrite Implementation
    try {
      await account.deleteSession('current');
    } catch (error) {
      throw new Error('Logout failed');
    }
    */
  },
  
  getCurrentUser: async (): Promise<User | null> => {
    // Mock get current user
    return currentUser;
    
    /* Appwrite Implementation
    try {
      const user = await account.get();
      // Fetch additional user data from the database
      const userData = await databases.listDocuments(
        DATABASE_ID,
        USER_COLLECTION_ID,
        [Query.equal('userId', user.$id)]
      );
      
      if (userData.documents.length > 0) {
        return {
          id: user.$id,
          email: user.email,
          name: user.name,
          ...userData.documents[0]
        };
      }
      return null;
    } catch (error) {
      return null;
    }
    */
  },
  
  // School functions
  verifySchoolToken: async (token: string): Promise<boolean> => {
    // Mock token verification
    // In a real app, this would validate the token against a database
    if (token === 'VALID_TOKEN') {
      if (currentUser && currentUser.userType === 'school') {
        currentUser.isVerified = true;
        return true;
      }
    }
    return false;
    
    /* Appwrite Implementation
    try {
      // Query the database for valid tokens
      const tokens = await databases.listDocuments(
        DATABASE_ID,
        TOKEN_COLLECTION_ID,
        [Query.equal('token', token), Query.equal('isUsed', false)]
      );
      
      if (tokens.documents.length > 0) {
        // Mark the token as used
        await databases.updateDocument(
          DATABASE_ID,
          TOKEN_COLLECTION_ID,
          tokens.documents[0].$id,
          { isUsed: true }
        );
        
        // Update the school's verification status
        const user = await account.get();
        await databases.updateDocument(
          DATABASE_ID,
          USER_COLLECTION_ID,
          user.$id,
          { isVerified: true }
        );
        
        return true;
      }
      return false;
    } catch (error) {
      throw new Error('Token verification failed');
    }
    */
  },
  
  // Student management functions
  getStudents: async (schoolId: string): Promise<Student[]> => {
    // Mock get students
    return mockStudents.filter(s => s.schoolId === schoolId);
    
    /* Appwrite Implementation
    try {
      const students = await databases.listDocuments(
        DATABASE_ID,
        STUDENT_COLLECTION_ID,
        [Query.equal('schoolId', schoolId)]
      );
      return students.documents;
    } catch (error) {
      throw new Error('Failed to fetch students');
    }
    */
  },
  
  addStudent: async (student: Partial<Student>): Promise<Student> => {
    // Mock add student
    const newStudent: Student = {
      id: String(mockStudents.length + 1),
      schoolId: student.schoolId || '',
      username: student.username || '',
      name: student.name || '',
      status: 'active'
    };
    
    mockStudents.push(newStudent);
    return newStudent;
    
    /* Appwrite Implementation
    try {
      // Create a new user account
      const user = await functions.createExecution(
        'CREATE_STUDENT_FUNCTION_ID',
        JSON.stringify({
          username: student.username,
          password: 'defaultPassword', // Generate a secure password
          name: student.name,
          schoolId: student.schoolId
        })
      );
      
      // Add student to the database
      const newStudent = await databases.createDocument(
        DATABASE_ID,
        STUDENT_COLLECTION_ID,
        ID.unique(),
        {
          userId: user.response.userId,
          schoolId: student.schoolId,
          username: student.username,
          name: student.name,
          status: 'active'
        }
      );
      
      return newStudent;
    } catch (error) {
      throw new Error('Failed to add student');
    }
    */
  },
  
  updateStudentStatus: async (studentId: string, status: 'active' | 'suspended'): Promise<Student> => {
    // Mock update student status
    const studentIndex = mockStudents.findIndex(s => s.id === studentId);
    if (studentIndex === -1) throw new Error('Student not found');
    
    mockStudents[studentIndex].status = status;
    return mockStudents[studentIndex];
    
    /* Appwrite Implementation
    try {
      const student = await databases.updateDocument(
        DATABASE_ID,
        STUDENT_COLLECTION_ID,
        studentId,
        { status }
      );
      return student;
    } catch (error) {
      throw new Error('Failed to update student status');
    }
    */
  },
  
  removeStudent: async (studentId: string): Promise<void> => {
    // Mock remove student
    const studentIndex = mockStudents.findIndex(s => s.id === studentId);
    if (studentIndex === -1) throw new Error('Student not found');
    
    mockStudents.splice(studentIndex, 1);
    
    /* Appwrite Implementation
    try {
      // Delete the student document
      await databases.deleteDocument(
        DATABASE_ID,
        STUDENT_COLLECTION_ID,
        studentId
      );
      
      // Delete the user account (this might require a server-side function)
      await functions.createExecution(
        'DELETE_STUDENT_FUNCTION_ID',
        JSON.stringify({ studentId })
      );
    } catch (error) {
      throw new Error('Failed to remove student');
    }
    */
  },
  
  bulkUploadStudents: async (file: File): Promise<Student[]> => {
    // Mock bulk upload - in a real app this would parse the CSV/PDF
    // For simplicity, we'll just add some dummy students
    const newStudents: Student[] = [
      {
        id: String(mockStudents.length + 1),
        schoolId: currentUser?.id || '',
        username: 'S004',
        name: 'Bulk Student 1',
        status: 'active'
      },
      {
        id: String(mockStudents.length + 2),
        schoolId: currentUser?.id || '',
        username: 'S005',
        name: 'Bulk Student 2',
        status: 'active'
      }
    ];
    
    mockStudents.push(...newStudents);
    return newStudents;
    
    /* Appwrite Implementation
    try {
      // Upload the file to storage
      const uploadedFile = await storage.createFile(
        BUCKET_ID,
        ID.unique(),
        file
      );
      
      // Process the file (CSV/PDF parsing would happen server-side)
      const processResult = await functions.createExecution(
        'PROCESS_STUDENT_FILE_FUNCTION_ID',
        JSON.stringify({
          fileId: uploadedFile.$id,
          schoolId: currentUser?.id
        })
      );
      
      return JSON.parse(processResult.response);
    } catch (error) {
      throw new Error('Failed to process student upload');
    }
    */
  },
  
  // Subject and Question functions
  getSubjects: async (): Promise<Subject[]> => {
    return mockSubjects;
  },
  
  getQuestionsBySubject: async (subjectId: string): Promise<Question[]> => {
    return mockQuestions.filter(q => q.subjectId === subjectId);
  },
  
  // Paper functions
  createPaper: async (paper: Partial<Paper>): Promise<Paper> => {
    const newPaper: Paper = {
      id: String(mockPapers.length + 1),
      title: paper.title || '',
      subjectId: paper.subjectId || '',
      questionIds: paper.questionIds || [],
      createdBy: currentUser?.id || '',
      createdAt: new Date()
    };
    
    mockPapers.push(newPaper);
    return newPaper;
  },
  
  getPapersBySchool: async (schoolId: string): Promise<Paper[]> => {
    return mockPapers.filter(p => p.createdBy === schoolId);
  },
  
  getPapersBySubjectForStudent: async (studentId: string, subjectId: string): Promise<Paper[]> => {
    // Get all papers for the subject
    const papers = mockPapers.filter(p => p.subjectId === subjectId);
    
    // Get the student's attempts for these papers
    const attempts = mockAttempts.filter(a => a.studentId === studentId);
    
    // Map the attempts to the papers
    const paperResults = papers.map(paper => {
      const attempt = attempts.find(a => a.paperId === paper.id);
      return {
        ...paper,
        attempted: !!attempt,
        score: attempt?.score
      };
    });
    
    return paperResults;
  },
  
  // Attempt functions
  getStudentAttempts: async (studentId: string): Promise<Attempt[]> => {
    return mockAttempts.filter(a => a.studentId === studentId);
  },
  
  getAttemptsByPaper: async (paperId: string): Promise<Attempt[]> => {
    return mockAttempts.filter(a => a.paperId === paperId);
  },
  
  createAttempt: async (attempt: Partial<Attempt>): Promise<Attempt> => {
    const newAttempt: Attempt = {
      id: String(mockAttempts.length + 1),
      studentId: attempt.studentId || '',
      paperId: attempt.paperId || '',
      startTime: new Date(),
      answers: attempt.answers || {}
    };
    
    mockAttempts.push(newAttempt);
    return newAttempt;
  },
  
  completeAttempt: async (attemptId: string, answers: Record<string, string | string[]>): Promise<Attempt> => {
    const attemptIndex = mockAttempts.findIndex(a => a.id === attemptId);
    if (attemptIndex === -1) throw new Error('Attempt not found');
    
    mockAttempts[attemptIndex].answers = answers;
    mockAttempts[attemptIndex].endTime = new Date();
    
    // Calculate score (simplified for mock)
    mockAttempts[attemptIndex].score = 75;
    
    return mockAttempts[attemptIndex];
  }
};
