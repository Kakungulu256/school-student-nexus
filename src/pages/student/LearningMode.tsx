
import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { api, Question, Subject } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';
import { Book, Check, X } from 'lucide-react';

export default function LearningMode() {
  const { toast } = useToast();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string | string[]>>({});
  const [isChecking, setIsChecking] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [questionType, setQuestionType] = useState<'objective' | 'checkbox' | 'dragdrop'>('objective');

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const data = await api.getSubjects();
        setSubjects(data);
        if (data.length > 0) {
          setSelectedSubject(data[0].id);
        }
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to fetch subjects',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubjects();
  }, [toast]);

  useEffect(() => {
    if (!selectedSubject) return;

    const fetchQuestions = async () => {
      setIsLoading(true);
      try {
        const data = await api.getQuestionsBySubject(selectedSubject);
        // Filter by selected question type
        const filteredQuestions = data.filter(q => q.type === questionType);
        setQuestions(filteredQuestions);
        setCurrentQuestionIndex(0);
        setUserAnswers({});
        setIsChecking(false);
        setIsCorrect(null);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to fetch questions',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, [selectedSubject, questionType, toast]);

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswer = (value: string | string[]) => {
    if (!currentQuestion) return;
    
    setUserAnswers({
      ...userAnswers,
      [currentQuestion.id]: value,
    });
  };

  const handleCheckAnswer = () => {
    if (!currentQuestion) return;
    
    setIsChecking(true);
    const userAnswer = userAnswers[currentQuestion.id];
    
    if (currentQuestion.type === 'checkbox') {
      // For checkbox, compare arrays
      const correct = 
        Array.isArray(userAnswer) && 
        Array.isArray(currentQuestion.correctAnswers) &&
        userAnswer.length === currentQuestion.correctAnswers.length &&
        userAnswer.every(a => currentQuestion.correctAnswers?.includes(a));
      
      setIsCorrect(correct);
    } else {
      // For objective and dragdrop
      const correct = 
        JSON.stringify(userAnswer) === JSON.stringify(currentQuestion.correctAnswers);
      
      setIsCorrect(correct);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setIsChecking(false);
      setIsCorrect(null);
    } else {
      toast({
        title: 'End of questions',
        description: 'You have completed all questions in this section.',
      });
    }
  };

  const getSubjectName = (id: string) => {
    const subject = subjects.find(s => s.id === id);
    return subject ? subject.name : '';
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Learning Mode</h1>
          <p className="text-muted-foreground">
            Practice with interactive questions to improve your skills
          </p>
        </div>
        
        {isLoading && !currentQuestion ? (
          <div className="flex justify-center items-center h-64">
            <p>Loading questions...</p>
          </div>
        ) : (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle>Question Types</CardTitle>
                    <CardDescription>
                      Select the type of questions you want to practice
                    </CardDescription>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Label className="mr-2">Subject:</Label>
                    <select
                      value={selectedSubject}
                      onChange={(e) => setSelectedSubject(e.target.value)}
                      className="border rounded px-2 py-1 text-sm"
                    >
                      {subjects.map((subject) => (
                        <option key={subject.id} value={subject.id}>
                          {subject.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs 
                  defaultValue="objective" 
                  value={questionType}
                  onValueChange={(value) => setQuestionType(value as 'objective' | 'checkbox' | 'dragdrop')}
                >
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="objective">Multiple Choice</TabsTrigger>
                    <TabsTrigger value="checkbox">Checkbox</TabsTrigger>
                    <TabsTrigger value="dragdrop">Drag & Drop</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="objective" className="mt-4 text-center">
                    Questions with a single correct answer
                  </TabsContent>
                  <TabsContent value="checkbox" className="mt-4 text-center">
                    Questions with multiple correct answers
                  </TabsContent>
                  <TabsContent value="dragdrop" className="mt-4 text-center">
                    Interactive matching exercises
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
            
            {questions.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center p-8">
                  <Book className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium">No questions available</h3>
                  <p className="text-gray-500">
                    There are no {questionType} questions available for {getSubjectName(selectedSubject)}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="flex items-center">
                        <span className="inline-block w-8 h-8 text-sm bg-education-primary text-white rounded-full flex items-center justify-center mr-2">
                          {currentQuestionIndex + 1}
                        </span>
                        {getSubjectName(selectedSubject)} Question
                      </CardTitle>
                      <CardDescription>
                        {questionType === 'objective' && 'Select the correct answer'}
                        {questionType === 'checkbox' && 'Select all that apply'}
                        {questionType === 'dragdrop' && 'Match the items'}
                      </CardDescription>
                    </div>
                    <div className="text-sm text-gray-500">
                      Question {currentQuestionIndex + 1} of {questions.length}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {currentQuestion && (
                    <>
                      <div className="text-lg font-medium mb-4">
                        {currentQuestion.text}
                      </div>
                      
                      {/* Objective Questions */}
                      {currentQuestion.type === 'objective' && (
                        <RadioGroup
                          value={
                            Array.isArray(userAnswers[currentQuestion.id])
                              ? (userAnswers[currentQuestion.id] as string[])[0]
                              : ''
                          }
                          onValueChange={(value) => handleAnswer([value])}
                        >
                          <div className="space-y-3">
                            {currentQuestion.options?.map((option) => (
                              <div key={option} className="flex items-center space-x-2">
                                <RadioGroupItem value={option} id={option} disabled={isChecking} />
                                <Label htmlFor={option}>{option}</Label>
                              </div>
                            ))}
                          </div>
                        </RadioGroup>
                      )}
                      
                      {/* Checkbox Questions */}
                      {currentQuestion.type === 'checkbox' && (
                        <div className="space-y-3">
                          {currentQuestion.options?.map((option) => (
                            <div key={option} className="flex items-center space-x-2">
                              <Checkbox
                                id={option}
                                checked={
                                  Array.isArray(userAnswers[currentQuestion.id]) && 
                                  (userAnswers[currentQuestion.id] as string[]).includes(option)
                                }
                                onCheckedChange={(checked) => {
                                  const currentAnswers = Array.isArray(userAnswers[currentQuestion.id])
                                    ? [...userAnswers[currentQuestion.id] as string[]]
                                    : [];
                                  
                                  if (checked) {
                                    handleAnswer([...currentAnswers, option]);
                                  } else {
                                    handleAnswer(
                                      currentAnswers.filter((a) => a !== option)
                                    );
                                  }
                                }}
                                disabled={isChecking}
                              />
                              <Label htmlFor={option}>{option}</Label>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {/* Drag & Drop Questions (simplified implementation) */}
                      {currentQuestion.type === 'dragdrop' && (
                        <div className="space-y-4">
                          <p className="text-yellow-600 text-sm">
                            Note: In a real implementation, this would be a drag & drop interface.
                            For this demo, we're using a simplified selection approach.
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {currentQuestion.options?.map((option, index) => (
                              <div
                                key={option}
                                className="border p-3 rounded-md bg-gray-50"
                              >
                                {option}
                                <select
                                  className="ml-2 border rounded"
                                  value={
                                    Array.isArray(userAnswers[currentQuestion.id])
                                      ? (userAnswers[currentQuestion.id] as string[])[index]
                                      : ''
                                  }
                                  onChange={(e) => {
                                    const currentAnswers = Array.isArray(
                                      userAnswers[currentQuestion.id]
                                    )
                                      ? [...userAnswers[currentQuestion.id] as string[]]
                                      : Array(currentQuestion.options?.length || 0).fill('');
                                    
                                    currentAnswers[index] = e.target.value;
                                    handleAnswer(currentAnswers);
                                  }}
                                  disabled={isChecking}
                                >
                                  <option value="">Select</option>
                                  {Array.from(
                                    { length: currentQuestion.options?.length || 0 },
                                    (_, i) => (i + 1).toString()
                                  ).map((num) => (
                                    <option key={num} value={num}>
                                      {num}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Feedback section */}
                      {isChecking && (
                        <div className={`mt-4 p-4 rounded-md ${
                          isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                        }`}>
                          <div className="flex items-center">
                            {isCorrect ? (
                              <Check className="h-5 w-5 text-green-500 mr-2" />
                            ) : (
                              <X className="h-5 w-5 text-red-500 mr-2" />
                            )}
                            <p className={isCorrect ? 'text-green-700' : 'text-red-700'}>
                              {isCorrect ? 'Correct!' : 'Incorrect!'}
                            </p>
                          </div>
                          
                          {!isCorrect && (
                            <div className="mt-2 text-sm">
                              <p className="font-medium">Correct answer:</p>
                              <p>
                                {Array.isArray(currentQuestion.correctAnswers)
                                  ? currentQuestion.correctAnswers.join(', ')
                                  : currentQuestion.correctAnswers}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                      
                      <div className="flex justify-between pt-4">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setCurrentQuestionIndex(
                              Math.max(0, currentQuestionIndex - 1)
                            );
                            setIsChecking(false);
                            setIsCorrect(null);
                          }}
                          disabled={currentQuestionIndex === 0}
                        >
                          Previous
                        </Button>
                        
                        <div className="space-x-2">
                          {!isChecking ? (
                            <Button
                              onClick={handleCheckAnswer}
                              disabled={
                                !userAnswers[currentQuestion.id] ||
                                (Array.isArray(userAnswers[currentQuestion.id]) &&
                                  (userAnswers[currentQuestion.id] as string[]).length === 0)
                              }
                            >
                              Check Answer
                            </Button>
                          ) : (
                            <Button
                              onClick={handleNextQuestion}
                              variant={
                                currentQuestionIndex < questions.length - 1
                                  ? 'default'
                                  : 'outline'
                              }
                            >
                              {currentQuestionIndex < questions.length - 1
                                ? 'Next Question'
                                : 'Finish'}
                            </Button>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
