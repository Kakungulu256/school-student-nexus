
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ArrowLeft, BookOpen, Clock, ThumbsUp } from 'lucide-react';

// Mock question data
const mockQuestions = {
  multipleChoice: [
    {
      id: 1,
      question: "Which of the following is NOT a prime number?",
      options: ["3", "5", "9", "11"],
      correctAnswer: "9",
    },
    {
      id: 2,
      question: "What is the formula for the area of a circle?",
      options: ["πr²", "2πr", "πd", "2πr²"],
      correctAnswer: "πr²",
    },
  ],
  checkbox: [
    {
      id: 3,
      question: "Select all the even numbers:",
      options: ["2", "3", "4", "6", "7", "8"],
      correctAnswers: ["2", "4", "6", "8"],
    },
    {
      id: 4,
      question: "Which of these are mammals?",
      options: ["Bat", "Snake", "Whale", "Crocodile", "Tiger"],
      correctAnswers: ["Bat", "Whale", "Tiger"],
    },
  ],
  dragAndDrop: [
    {
      id: 5,
      question: "Match the countries with their capitals:",
      pairs: [
        { item: "France", match: "Paris" },
        { item: "Japan", match: "Tokyo" },
        { item: "Egypt", match: "Cairo" },
        { item: "Brazil", match: "Brasília" },
      ],
    },
  ],
};

export default function LearningMode() {
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState('multiple-choice');
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [checkboxAnswers, setCheckboxAnswers] = useState<Record<number, string[]>>({});
  const [showResults, setShowResults] = useState(false);

  const handleRadioChange = (questionId: number, value: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleCheckboxChange = (questionId: number, value: string) => {
    setCheckboxAnswers(prev => {
      const currentSelections = prev[questionId] || [];
      const newSelections = currentSelections.includes(value)
        ? currentSelections.filter(item => item !== value)
        : [...currentSelections, value];
      
      return {
        ...prev,
        [questionId]: newSelections
      };
    });
  };

  const handleSubmit = () => {
    setShowResults(true);
    // In a real application, you would process answers here
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handleBackToDashboard}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold tracking-tight">Learning Mode</h1>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <BookOpen className="h-4 w-4" />
            <span>Practice Questions</span>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Interactive Practice</CardTitle>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>No time limit</span>
              </div>
            </div>
            <CardDescription>
              Answer questions to improve your understanding of the subject
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={currentTab} onValueChange={setCurrentTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="multiple-choice">Multiple Choice</TabsTrigger>
                <TabsTrigger value="checkbox">Checkbox Selection</TabsTrigger>
                <TabsTrigger value="drag-and-drop">Drag & Drop</TabsTrigger>
              </TabsList>
              
              <TabsContent value="multiple-choice" className="space-y-6">
                {mockQuestions.multipleChoice.map((q) => (
                  <div key={q.id} className="p-4 border rounded-lg space-y-4">
                    <div className="font-medium">{q.question}</div>
                    <RadioGroup 
                      value={selectedAnswers[q.id] || ""} 
                      onValueChange={(value) => handleRadioChange(q.id, value)}
                    >
                      {q.options.map((option) => (
                        <div key={option} className="flex items-center space-x-2">
                          <RadioGroupItem value={option} id={`q${q.id}-${option}`} />
                          <Label 
                            htmlFor={`q${q.id}-${option}`}
                            className={
                              showResults 
                                ? option === q.correctAnswer 
                                  ? "text-green-600 font-medium" 
                                  : selectedAnswers[q.id] === option && option !== q.correctAnswer 
                                    ? "text-red-600 line-through" 
                                    : ""
                                : ""
                            }
                          >
                            {option}
                            {showResults && option === q.correctAnswer && (
                              <ThumbsUp className="inline-block ml-2 h-4 w-4 text-green-600" />
                            )}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                    {showResults && (
                      <div className={
                        selectedAnswers[q.id] === q.correctAnswer 
                          ? "text-green-600 text-sm mt-2" 
                          : "text-red-600 text-sm mt-2"
                      }>
                        {selectedAnswers[q.id] === q.correctAnswer 
                          ? "Correct! Well done." 
                          : `Incorrect. The correct answer is ${q.correctAnswer}.`}
                      </div>
                    )}
                  </div>
                ))}
              </TabsContent>
              
              <TabsContent value="checkbox" className="space-y-6">
                {mockQuestions.checkbox.map((q) => (
                  <div key={q.id} className="p-4 border rounded-lg space-y-4">
                    <div className="font-medium">{q.question}</div>
                    <div className="grid grid-cols-2 gap-2">
                      {q.options.map((option) => (
                        <div key={option} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`q${q.id}-${option}`} 
                            checked={(checkboxAnswers[q.id] || []).includes(option)}
                            onCheckedChange={() => handleCheckboxChange(q.id, option)}
                          />
                          <Label 
                            htmlFor={`q${q.id}-${option}`}
                            className={
                              showResults 
                                ? q.correctAnswers.includes(option) 
                                  ? "text-green-600 font-medium" 
                                  : (checkboxAnswers[q.id] || []).includes(option) && !q.correctAnswers.includes(option) 
                                    ? "text-red-600 line-through" 
                                    : ""
                                : ""
                            }
                          >
                            {option}
                          </Label>
                        </div>
                      ))}
                    </div>
                    {showResults && (
                      <div className="text-sm mt-2">
                        <div>Correct answers: {q.correctAnswers.join(", ")}</div>
                        <div className={
                          JSON.stringify((checkboxAnswers[q.id] || []).sort()) === JSON.stringify(q.correctAnswers.sort())
                            ? "text-green-600" 
                            : "text-red-600"
                        }>
                          {JSON.stringify((checkboxAnswers[q.id] || []).sort()) === JSON.stringify(q.correctAnswers.sort())
                            ? "Correct! All options selected properly."
                            : "Some selections were incorrect."}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </TabsContent>
              
              <TabsContent value="drag-and-drop" className="space-y-6">
                <div className="p-4 border rounded-lg">
                  <div className="mb-4 font-medium">
                    {mockQuestions.dragAndDrop[0].question}
                  </div>
                  <div className="bg-yellow-50 p-4 rounded border border-yellow-200 text-yellow-800">
                    Drag and drop functionality requires JavaScript interaction.
                    In a real implementation, you would be able to drag items from the left 
                    column and drop them onto matching items in the right column.
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="space-y-2">
                      <h3 className="font-medium text-sm text-gray-500">Items</h3>
                      {mockQuestions.dragAndDrop[0].pairs.map(pair => (
                        <div key={pair.item} className="p-2 bg-blue-50 border border-blue-100 rounded">
                          {pair.item}
                        </div>
                      ))}
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-medium text-sm text-gray-500">Matches</h3>
                      {mockQuestions.dragAndDrop[0].pairs.map(pair => (
                        <div key={pair.match} className="p-2 bg-purple-50 border border-purple-100 rounded">
                          {pair.match}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="mt-6 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowResults(false)}>
                Reset
              </Button>
              <Button onClick={handleSubmit}>
                Check Answers
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
