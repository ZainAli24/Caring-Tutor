import { Student, TestResult } from "./types";

export const MOCK_STUDENTS: Student[] = [
    {
        id: 'user_1',
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
        avatar: 'avatar-1',
        sentiment: 'calm',
        lastActivity: '2 hours ago',
        progress: 75,
    },
    {
        id: 'user_2',
        name: 'John Smith',
        email: 'john.smith@example.com',
        avatar: 'avatar-2',
        sentiment: 'stressed',
        lastActivity: '1 day ago',
        progress: 40,
    },
    {
        id: 'user_3',
        name: 'Emily White',
        email: 'emily.white@example.com',
        avatar: 'avatar-3',
        sentiment: 'neutral',
        lastActivity: '5 hours ago',
        progress: 90,
    },
    {
        id: 'user_4',
        name: 'Michael Brown',
        email: 'michael.brown@example.com',
        avatar: 'avatar-4',
        sentiment: 'calm',
        lastActivity: '3 days ago',
        progress: 60,
    },
];

export const MOCK_TEST_RESULTS: TestResult[] = [
    {
        id: 'test_1',
        userId: 'user_1',
        topic: 'Algebra Basics',
        score: 80,
        correctAnswers: 4,
        totalQuestions: 5,
        date: '2024-05-20T10:00:00Z',
    },
    {
        id: 'test_2',
        userId: 'user_1',
        topic: 'Linear Equations',
        score: 90,
        correctAnswers: 9,
        totalQuestions: 10,
        date: '2024-05-22T14:30:00Z',
    },
    {
        id: 'test_3',
        userId: 'user_1',
        topic: 'Calculus Fundamentals',
        score: 75,
        correctAnswers: 6,
        totalQuestions: 8,
        date: '2024-05-24T09:00:00Z',
    },
    {
        id: 'test_4',
        userId: 'user_1',
        topic: 'Python Data Structures',
        score: 100,
        correctAnswers: 5,
        totalQuestions: 5,
        date: '2024-05-25T11:00:00Z',
    },
    {
        id: 'test_5',
        userId: 'user_1',
        topic: 'React Hooks',
        score: 60,
        correctAnswers: 3,
        totalQuestions: 5,
        date: '2024-05-26T16:00:00Z',
    }
];
