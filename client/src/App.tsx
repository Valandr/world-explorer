import { Routes, Route } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import Home from './pages/Home';
import Explorer from './pages/Explorer';
import Quiz from './pages/Quiz';
import QuizPlay from './pages/QuizPlay';
import Results from './pages/Results';

export default function App() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explorer" element={<Explorer />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/quiz/play" element={<QuizPlay />} />
        <Route path="/results" element={<Results />} />
      </Routes>
    </AppLayout>
  );
}
