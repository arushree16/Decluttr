import React, { useState, useEffect } from 'react';
import {
  Box, Button, Heading, Input, VStack, Text, Flex, Textarea, HStack, IconButton, Checkbox, Avatar
} from '@chakra-ui/react';
import { auth, provider } from './firebase';
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { FaMicrophone } from 'react-icons/fa';
import axios from 'axios'; // Add this import at the top
import { CloseIcon } from '@chakra-ui/icons'; // Add this import at the top
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import { useColorMode, useColorModeValue } from '@chakra-ui/react';

const moodEmojis = [
  { label: 'Sad', icon: '😞' },
  { label: 'Meh', icon: '😐' },
  { label: 'Okay', icon: '🙂' },
  { label: 'Good', icon: '😊' },
  { label: 'Great', icon: '😁' },
];

function App() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [thought, setThought] = useState('');
  const [tasks, setTasks] = useState(null);
  const [newTask, setNewTask] = useState('');
  const [suggestion, setSuggestion] = useState('You seem burnt out – how about doing a quick meditation session?');
  const [mood, setMood] = useState(null);
  const [moodHistory, setMoodHistory] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [thoughtHistory, setThoughtHistory] = useState([]);
  const [suggestionHistory, setSuggestionHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const { colorMode, toggleColorMode } = useColorMode();
  const bgGradient = useColorModeValue(
    "linear(to-br, green.50, blue.50, teal.100)",
    "linear(to-br, #232526, #414345, #141E30, #243B55)"
  );

  const dashboardBg = useColorModeValue(
    "rgba(255,255,255,0.7)",
    "rgba(36, 43, 85, 0.7)"
  );

  const cardBg = useColorModeValue(
    "#f8f7f4",
    "rgba(44, 62, 80, 0.7)"
  );

  const headingColor = useColorModeValue("#222", "gray.100");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const boxShadow = useColorModeValue("2xl", "0 8px 32px 0 rgba(44, 62, 80, 0.37)");

  const [userId, setUserId] = useState(() => {
    const localId = localStorage.getItem('decluttr_user_id');
    if (localId) return localId;
    const newId = 'guest_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('decluttr_user_id', newId);
    return newId;
  });

  const [categories, setCategories] = useState({});
  const [categorySuggestions, setCategorySuggestions] = useState({});

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      // Load data from backend when user changes
      await loadDataFromBackend();
    });
    return () => unsubscribe();
  }, []);

  // Remove the conflicting useEffect that saves tasks
  // useEffect(() => {
  //   saveTasks(tasks);
  // }, [tasks, user]);

  // Remove the conflicting useEffect that saves histories
  // useEffect(() => {
  //   saveAllHistories(thoughtHistory, suggestionHistory, moodHistory);
  // }, [thoughtHistory, suggestionHistory, moodHistory, user]);

  // Single useEffect to save data to backend
  useEffect(() => {
    if (tasks === null) return; // Don't save until loaded
    saveDataToBackend();
  }, [thoughtHistory, suggestionHistory, moodHistory, tasks, userId]);

  // Load data from backend
  const loadDataFromBackend = async () => {
    const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
    console.log('Loading data from:', backendUrl);
    console.log('User ID:', userId);
    
    try {
      const response = await fetch(`${backendUrl}/api/user/${userId}`);
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Loaded data:', data);
      
      setThoughtHistory(data.thoughtHistory || []);
      setSuggestionHistory(data.suggestionHistory || []);
      setMoodHistory(data.moodHistory || []);
      
      if (data.tasks && data.tasks.length > 0) {
        setTasks(data.tasks);
      } else {
        // Only set default tasks if no tasks exist in database
        setTasks([
          { text: 'Prepare presentation', done: false },
          { text: 'Wish mom a happy birthday', done: false },
          { text: 'Study for DSA exam', done: false },
          { text: 'Call the dentist', done: false },
          { text: 'Take a break and relax', done: false },
        ]);
      }
    } catch (err) {
      console.error('Load error:', err);
      // Set default tasks only on error
      setTasks([
        { text: 'Prepare presentation', done: false },
        { text: 'Wish mom a happy birthday', done: false },
        { text: 'Study for DSA exam', done: false },
        { text: 'Call the dentist', done: false },
        { text: 'Take a break and relax', done: false },
      ]);
    }
  };

  // Save data to backend
  const saveDataToBackend = async () => {
    const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
    console.log('Saving data to:', backendUrl);
    console.log('User ID:', userId);
    console.log('Tasks to save:', tasks);
    
    try {
      const response = await fetch(`${backendUrl}/api/user/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          thoughtHistory,
          suggestionHistory,
          moodHistory,
          tasks,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Saved successfully:', data);
    } catch (err) {
      console.error('Save error:', err);
    }
  };

  // Remove the old useEffect that was loading data
  // useEffect(() => {
  //   const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
  //   console.log('Loading data from:', backendUrl);
  //   console.log('User ID:', userId);
  //   
  //   fetch(`${backendUrl}/api/user/${userId}`)
  //     .then(res => {
  //       console.log('Response status:', res.status);
  //       if (!res.ok) {
  //         throw new Error(`HTTP error! status: ${res.status}`);
  //       }
  //       return res.json();
  //     })
  //     .then(data => {
  //       console.log('Loaded data:', data);
  //       setThoughtHistory(data.thoughtHistory || []);
  //       setSuggestionHistory(data.suggestionHistory || []);
  //       setMoodHistory(data.moodHistory || []);
  //       if (data.tasks && data.tasks.length > 0) {
  //         setTasks(data.tasks);
  //       } else {
  //         setTasks([
  //           { text: 'Prepare presentation', done: false },
  //           { text: 'Wish mom a happy birthday', done: false },
  //           { text: 'Study for DSA exam', done: false },
  //           { text: 'Call the dentist', done: false },
  //           { text: 'Take a break and relax', done: false },
  //         ]);
  //       }
  //     })
  //     .catch(err => {
  //       console.error('Load error:', err);
  //       // Set default tasks even on error to prevent infinite loading
  //       setTasks([
  //         { text: 'Prepare presentation', done: false },
  //         { text: 'Wish mom a happy birthday', done: false },
  //         { text: 'Study for DSA exam', done: false },
  //         { text: 'Call the dentist', done: false },
  //         { text: 'Take a break and relax', done: false },
  //       ]);
  //     });
  // }, [userId]);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEmailAuth = async () => {
    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
  };

  const handleAddTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, { text: newTask, done: false }]);
      setNewTask('');
    }
  };

  const handleTaskToggle = (idx) => {
    setTasks(tasks.map((t, i) => i === idx ? { ...t, done: !t.done } : t));
    if (!tasks[idx].done) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 1200);
    }
  };

  const handleDeleteTask = (idx) => {
    setTasks(tasks.filter((_, i) => i !== idx));
  };

  const handleThoughtSubmit = async () => {
    if (!thought.trim()) return;

    // 1. Try OpenAI
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `
              You are an assistant that helps users declutter their mind.
              When given a thought dump, split it into individual thoughts if needed.
              Categorize each thought into one of: Academic, Project, Emotional, Social, Personal, Other.
              For each category, extract actionable tasks (if any) as a list.
              For each category, provide a helpful suggestion.
              For each suggestion, start with the original thought line, then a right arrow (→), then the suggestion. Example: "Finish my assignment" → "Try breaking the assignment into smaller tasks."
              Return a JSON object like:
              {
                "categories": {
                  "Academic": ["thought1", "thought2"],
                  "Project": ["thought3"],
                  "Emotional": ["thought4"]
                },
                "tasks": ["task1", "task2"],
                "suggestions": {
                  "Academic": ["thought1 → suggestion1", "thought2 → suggestion2"],
                  "Project": ["thought3 → suggestion3"],
                  "Emotional": ["thought4 → suggestion4"]
                }
              }
              Only include categories that have thoughts.
            `
            },
            {
              role: 'user',
              content: thought,
            },
          ],
          temperature: 0.7,
          max_tokens: 400,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
        }
      );

      // Parse the AI's JSON response
      const content = response.data.choices[0].message.content;
      let aiResult;
      try {
        aiResult = JSON.parse(content);
      } catch (e) {
        aiResult = { categories: {}, tasks: [], suggestions: {} };
      }

      // Update categories and suggestions
      setCategories(aiResult.categories || {});
      setCategorySuggestions(aiResult.suggestions || {});

      // Add new tasks to To-Do
      if (aiResult.tasks && Array.isArray(aiResult.tasks)) {
        setTasks((prev) => [
          ...prev,
          ...aiResult.tasks.map((t) => ({ text: t, done: false })),
        ]);
      }

      setThought('');
      setThoughtHistory((prev) => [
        ...prev,
        { text: thought, date: new Date().toISOString() }
      ]);
      setSuggestionHistory((prev) => [
        ...prev,
        { text: JSON.stringify(aiResult.suggestions), date: new Date().toISOString() }
      ]);
      return;
    } catch (error) {
      if (error.response && error.response.status === 429) {
        // 2. Try Cohere
        try {
          const cohereResponse = await axios.post(
            'https://api.cohere.ai/v1/chat',
            {
              model: 'command',
              message: `
              Given this thought dump: "${thought}", 
              split it into individual thoughts if needed.
              Categorize each thought into one of: Academic, Project, Emotional, Social, Personal, Other.
              For each category, extract actionable tasks (if any) as a list.
              For each category, provide a helpful suggestion.
              For each suggestion, start with the original thought line, then a right arrow (→), then the suggestion. Example: "Finish my assignment" → "Try breaking the assignment into smaller tasks."
              Return a JSON object like:
              {
                "categories": {
                  "Academic": ["thought1", "thought2"],
                  "Project": ["thought3"],
                  "Emotional": ["thought4"]
                },
                "tasks": ["task1", "task2"],
                "suggestions": {
                  "Academic": ["thought1 → suggestion1", "thought2 → suggestion2"],
                  "Project": ["thought3 → suggestion3"],
                  "Emotional": ["thought4 → suggestion4"]
                }
              }
              Only include categories that have thoughts.
            `,
            },
            {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.COHERE_API_KEY}`,
              },
            }
          );

          let cohereContent = cohereResponse.data.text || cohereResponse.data.message || '';
          let aiResult;
          try {
            aiResult = JSON.parse(cohereContent);
          } catch (e) {
            aiResult = { categories: {}, tasks: [], suggestions: {} };
          }

          setCategories(aiResult.categories || {});
          setCategorySuggestions(aiResult.suggestions || {});

          if (aiResult.tasks && Array.isArray(aiResult.tasks)) {
            setTasks((prev) => [
              ...prev,
              ...aiResult.tasks.map((t) => ({ text: t, done: false })),
            ]);
          }

          setThought('');
          setThoughtHistory((prev) => [
            ...prev,
            { text: thought, date: new Date().toISOString() }
          ]);
          setSuggestionHistory((prev) => [
            ...prev,
            { text: JSON.stringify(aiResult.suggestions), date: new Date().toISOString() }
          ]);
          return;
        } catch (error2) {
          // If Cohere fails, fall through to mock
        }
      }
      // 3. Mock fallback
      setCategories({ "Other": [thought] });
      setCategorySuggestions({ "Other": [ `${thought} → Try breaking your thoughts into categories for better clarity.` ] });
      setTasks((prev) => [
        ...prev,
        { text: 'Mock task 1', done: false },
        { text: 'Mock task 2', done: false },
      ]);
      setThought('');
      setThoughtHistory((prev) => [
        ...prev,
        { text: thought, date: new Date().toISOString() }
      ]);
      setSuggestionHistory((prev) => [
        ...prev,
        { text: `${thought} → Try breaking your thoughts into categories for better clarity.`, date: new Date().toISOString() }
      ]);
    }
  };

  const handleVoiceInput = () => {
    // Check for browser support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Sorry, your browser does not support speech recognition.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsRecording(true);
    recognition.onend = () => setIsRecording(false);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setThought((prev) => prev ? prev + ' ' + transcript : transcript);
    };

    recognition.onerror = (event) => {
      setIsRecording(false);
      alert('Voice input error: ' + event.error);
    };

    recognition.start();
  };

  // Data persistence is now handled by MongoDB backend only
  // Removed Firebase/localStorage functions to prevent conflicts

  const handleMoodSelect = (idx) => {
    setMood(idx);
    const newEntry = { mood: idx, date: new Date().toISOString() };
    setMoodHistory((prev) => [...prev, newEntry]);
  };

  const handleDeleteMoodEntry = (idx) => {
    setMoodHistory((prev) => prev.filter((_, i) => i !== idx));
  };

  const moodButtonVariants = {
    selected: { scale: 1.3 },
    unselected: { scale: 1 }
  };

  if (!user) {
    return (
      <Flex minH="100vh" align="center" justify="center" bg="#f8f7f4">
        <Box bg="white" p={8} rounded="xl" boxShadow="lg" minW="350px">
          <Heading mb={4} fontWeight="black" fontSize="2xl" color="#222">
            Decluttr.
          </Heading>
          <Text mb={6} color="gray.600">
            Sign in to declutter your mind
          </Text>
          <VStack spacing={3} mb={4}>
            <Input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              bg="#f8f7f4"
              borderColor="#e2e8f0"
            />
            <Input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              bg="#f8f7f4"
              borderColor="#e2e8f0"
            />
            <Button colorScheme="green" w="100%" onClick={handleEmailAuth}>
              {isRegister ? 'Register' : 'Sign In'}
            </Button>
            <Button variant="link" colorScheme="green" onClick={() => setIsRegister((r) => !r)}>
              {isRegister ? 'Already have an account? Sign In' : "Don't have an account? Register"}
            </Button>
          </VStack>
          <Button w="100%" colorScheme="gray" variant="outline" onClick={handleGoogleSignIn}>
            Sign in with Google
          </Button>
        </Box>
      </Flex>
    );
  }

  if (tasks === null) {
    return (
      <Box 
        minH="100vh" 
        display="flex" 
        alignItems="center" 
        justifyContent="center"
        bgGradient="linear(to-br, green.50, blue.50, teal.100)"
      >
        <VStack spacing={4}>
          <Text fontSize="2xl" fontWeight="bold" color="gray.600">
            🌱 Loading Decluttr...
          </Text>
          <Text fontSize="sm" color="gray.500">
            Connecting to your mind decluttering space
          </Text>
        </VStack>
      </Box>
    );
  }

  // Dashboard layout
  return (
    <Box minH="100vh" bgGradient={bgGradient} transition="background 0.5s" p={0}>
      <Box
        w="100%"
        py={4}
        px={8}
        position="fixed"
        top={0}
        left={0}
        zIndex={100}
        bg="transparent"
        display="flex"
        alignItems="center"
        justifyContent="flex-start"
      >
        <Text
          as="span"
          fontSize="2xl"
          mr={2}
          role="img"
          aria-label="leaf"
        >
          🌱
        </Text>
        <Text
          fontFamily="'Poppins', 'Inter', sans-serif"
          fontWeight="extrabold"
          fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}
          color="#222"
          letterSpacing="wide"
          bgGradient="linear(to-r, teal.400, blue.400, purple.500)"
          bgClip="text"
          userSelect="none"
        >
          Decluttr.
        </Text>
      </Box>
      <Box h="72px" /> {/* Spacer to push content below the fixed logo */}
      <Flex minH="100vh" align="center" justify="center" p={4}>
        <Box
          bg={dashboardBg}
          backdropFilter="blur(12px)"
          p={10}
          rounded="3xl"
          boxShadow={boxShadow}
          w="100%"
          maxW="1400px"
          transition="all 0.3s"
        >
          {/* Accent bar for dark mode */}
          <Box
            h="4px"
            w="100%"
            bgGradient="linear(to-r, teal.400, blue.400, purple.500)"
            borderRadius="xl"
            mb={4}
            boxShadow="0 0 16px 2px teal"
            display={colorMode === "dark" ? "block" : "none"}
          />
          {/* Header */}
          <Flex justify="space-between" align="center" mb={8}>
            <HStack>
              <Avatar
                name={user.displayName || user.email}
                src={user.photoURL}
                size="lg"
                mr={4}
                border="3px solid #68D391"
              />
              <Box>
                <Heading fontWeight="black" fontSize="2xl" color={headingColor} fontFamily="Poppins, Inter, sans-serif">
                  Hi, {user.displayName?.split(' ')[0] || user.email?.split('@')[0]}!
                </Heading>
                <Text color="gray.500" fontSize="md">Ready to declutter your mind?</Text>
              </Box>
            </HStack>
            <HStack spacing={4}>
              <Button
                colorScheme="gray"
                variant="outline"
                size="sm"
                onClick={() => setShowHistory((prev) => !prev)}
              >
                {showHistory ? "Back to Dashboard" : "View History"}
              </Button>
              <Button onClick={toggleColorMode} size="sm" variant="ghost">
                {colorMode === "light" ? "🌙" : "☀️"}
              </Button>
              <Button colorScheme="green" variant="outline" size="sm" onClick={handleSignOut}>
                Sign Out
              </Button>
            </HStack>
          </Flex>
          {!showHistory && (
            <>
              {/* First Row: Thought Dump & To-Do List */}
              <Flex gap={8} flexWrap={{ base: 'wrap', md: 'nowrap' }} mb={8}>
                {/* Thought Dump */}
                <Box flex={2.5} minH="220px" minW="350px">
                  <Heading fontSize="lg" mb={2} fontFamily="Poppins, Inter, sans-serif">Thought Dump</Heading>
                  <Textarea
                    placeholder="What's cluttering your mind right now?"
                    value={thought}
                    onChange={e => setThought(e.target.value)}
                    bg="#f8f7f4"
                    mb={2}
                    minH="120px"
                    fontSize="md"
                  />
                  <HStack>
                    <IconButton
                      icon={<FaMicrophone />}
                      aria-label="Voice input"
                      variant={isRecording ? "solid" : "ghost"}
                      colorScheme={isRecording ? "red" : "gray"}
                      onClick={handleVoiceInput}
                      isLoading={isRecording}
                      isRound
                    />
                    <Button colorScheme="green" onClick={handleThoughtSubmit} fontWeight="bold">
                      Declutter
                    </Button>
                  </HStack>
                </Box>
                {/* To-Do List */}
                <Box flex={2.5} minW="350px">
                  <Heading fontSize="lg" mb={2} fontFamily="Poppins, Inter, sans-serif">To-Do List</Heading>
                  <VStack align="stretch" spacing={2} mb={2}>
                    <AnimatePresence>
                      {tasks.map((task, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: 30 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -30 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Flex align="center">
                            <Checkbox
                              isChecked={task.done}
                              onChange={() => handleTaskToggle(idx)}
                              colorScheme="green"
                              flex="1"
                            >
                              <Text as={task.done ? 's' : undefined} color={task.done ? 'gray.400' : 'black'}>
                                {task.text}
                              </Text>
                            </Checkbox>
                            <IconButton
                              icon={<span style={{ fontSize: '1.1em', fontWeight: 'bold' }}>✕</span>}
                              aria-label="Delete task"
                              size="sm"
                              colorScheme="red"
                              variant="ghost"
                              ml={2}
                              onClick={() => handleDeleteTask(idx)}
                            />
                          </Flex>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </VStack>
                  <HStack>
                    <Input
                      placeholder="Add task"
                      value={newTask}
                      onChange={e => setNewTask(e.target.value)}
                      bg="#f8f7f4"
                    />
                    <Button onClick={handleAddTask} colorScheme="green" fontWeight="bold">+</Button>
                  </HStack>
                </Box>
              </Flex>
              {/* Second Row: Mood Tracking & Suggestions */}
              <Flex gap={8} flexWrap={{ base: 'wrap', md: 'nowrap' }}>
                {/* Mood Tracking */}
                <Box flex={1} minW="250px">
                  <Heading fontSize="lg" mb={2} fontFamily="Poppins, Inter, sans-serif">Mood Tracking</Heading>
                  <HStack spacing={2}>
                    {moodEmojis.map((m, idx) => (
                      <motion.div
                        key={m.label}
                        animate={mood === idx ? "selected" : "unselected"}
                        variants={moodButtonVariants}
                        style={{ display: "inline-block" }}
                      >
                        <Button
                          variant={mood === idx ? 'solid' : 'ghost'}
                          colorScheme={mood === idx ? 'green' : 'gray'}
                          fontSize="2xl"
                          onClick={() => handleMoodSelect(idx)}
                          transition="all 0.2s"
                        >
                          {m.icon}
                        </Button>
                      </motion.div>
                    ))}
                  </HStack>
                </Box>
                {/* Suggestions */}
                <Box flex={2} minW="350px">
                  <Heading fontSize="lg" mb={2} fontFamily="Poppins, Inter, sans-serif">Suggestions</Heading>
                  <Box
                    bg={cardBg}
                    p={4}
                    rounded="lg"
                    minH="80px"
                    boxShadow="md"
                    display="flex"
                    flexDirection="column"
                    alignItems="flex-start"
                  >
                    {Object.keys(categories).length === 0 && (
                      <Text fontSize="md" color={textColor}>
                        <span role="img" aria-label="lightbulb">💡</span> {suggestion}
                      </Text>
                    )}
                    {Object.keys(categories).map(cat => (
                      <Box key={cat} mb={3} w="100%">
                        <Text fontWeight="bold" color="teal.600">{cat}</Text>
                        <VStack align="start" pl={2} spacing={1}>
                          {categories[cat].map((thought, idx) => (
                            <Text key={idx} fontSize="sm">- {thought}</Text>
                          ))}
                        </VStack>
                        {categorySuggestions[cat] && Array.isArray(categorySuggestions[cat]) && categorySuggestions[cat].length > 0 && (
                          <VStack align="start" pl={2} spacing={1} mt={1}>
                            {categorySuggestions[cat].map((sugg, i) => (
                              <Text color="green.600" fontSize="sm" key={i}>{sugg}</Text>
                            ))}
                          </VStack>
                        )}
                        {categorySuggestions[cat] && !Array.isArray(categorySuggestions[cat]) && (
                          <Text color="green.600" fontSize="sm" mt={1}>{categorySuggestions[cat]}</Text>
                        )}
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Flex>
              {/* Floating Add Button for Mobile */}
              <Box
                display={{ base: 'block', md: 'none' }}
                position="fixed"
                bottom={8}
                right={8}
                zIndex={100}
              >
                <Button
                  colorScheme="green"
                  size="lg"
                  rounded="full"
                  boxShadow="xl"
                  onClick={() => {
                    // Focus the add task input or open a modal for quick add
                    document.querySelector('input[placeholder="Add task"]')?.focus();
                  }}
                >
                  +
                </Button>
              </Box>
            </>
          )}
          {/* --- HISTORY VIEW --- */}
          {showHistory && (
            <Box>
              <Heading fontSize="xl" mb={4}>Your History</Heading>
              {/* Thought History */}
              <Box mb={6}>
                <Heading fontSize="md" mb={2}>Thought History</Heading>
                <VStack align="start" maxH="150px" overflowY="auto">
                  {thoughtHistory.length === 0 && <Text color="gray.400">No thoughts yet.</Text>}
                  {thoughtHistory.map((entry, idx) => (
                    <Flex key={idx} align="center">
                      <Text fontSize="sm" mr={4}>
                        {new Date(entry.date).toLocaleDateString()}: {entry.text}
                      </Text>
                      <IconButton
                        icon={<CloseIcon boxSize={2.5} />}
                        aria-label="Delete thought entry"
                        size="xs"
                        colorScheme="red"
                        variant="ghost"
                        ml={4}
                        onClick={() => setThoughtHistory((prev) => prev.filter((_, i) => i !== idx))}
                      />
                    </Flex>
                  ))}
                </VStack>
              </Box>
              {/* Suggestion History */}
              <Box mb={6}>
                <Heading fontSize="md" mb={2}>Suggestion History</Heading>
                <VStack align="start" maxH="150px" overflowY="auto">
                  {suggestionHistory.length === 0 && <Text color="gray.400">No suggestions yet.</Text>}
                  {suggestionHistory.map((entry, idx) => (
                    <Flex key={idx} align="center">
                      <Text fontSize="sm" mr={4}>
                        {new Date(entry.date).toLocaleDateString()}: {entry.text}
                      </Text>
                      <IconButton
                        icon={<CloseIcon boxSize={2.5} />}
                        aria-label="Delete suggestion entry"
                        size="xs"
                        colorScheme="red"
                        variant="ghost"
                        ml={4}
                        onClick={() => setSuggestionHistory((prev) => prev.filter((_, i) => i !== idx))}
                      />
                    </Flex>
                  ))}
                </VStack>
              </Box>
              {/* Mood History */}
              <Box mb={6}>
                <Heading fontSize="md" mb={2}>Mood History</Heading>
                <VStack align="start" maxH="150px" overflowY="auto">
                  {moodHistory.length === 0 && <Text color="gray.400">No mood history yet.</Text>}
                  {moodHistory.map((entry, idx) => (
                    <Flex key={idx} align="center">
                      <Text fontSize="sm" mr={4}>
                        {new Date(entry.date).toLocaleDateString()}: {moodEmojis[entry.mood].icon}
                      </Text>
                      <IconButton
                        icon={<CloseIcon boxSize={2.5} />}
                        aria-label="Delete mood entry"
                        size="xs"
                        colorScheme="red"
                        variant="ghost"
                        ml={4}
                        onClick={() => setMoodHistory((prev) => prev.filter((_, i) => i !== idx))}
                      />
                    </Flex>
                  ))}
                </VStack>
              </Box>
            </Box>
          )}
        </Box>
      </Flex>
    </Box>
  );
}

export default App;
