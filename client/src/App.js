import logo from './logo.svg';
import './App.css';
import { ChakraProvider } from '@chakra-ui/react';
import { Textarea, Button, Box, HStack, VStack } from '@chakra-ui/react'
import {useState} from 'react';

function App() {
  let [review, setReview] = useState('')
  let [generatedText, setGeneratedText] = useState('')
  let handleReviewChange = (e) => {
    let inputValue = e.target.value
    setReview(inputValue)
  }

  let handleGenerateClick = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({review}),
      });

      if(!response.ok) {
        throw new Error("Network error");
      }

      const data = await response.json();
      setGeneratedText(data.result);
    } catch (error) {
      console.log("Error: ", error);
    }
  }

  return (
    <ChakraProvider>
        <header className="App-header">
          <h1> Your Review </h1>
          <div className='textarea'>
            <Textarea
              placeholder='Here is a sample placeholder'
              colorScheme='red'
              size='lg'
              value = {review}
              onChange={handleReviewChange}
            />
          </div>
          <Button
            colorScheme='red'
            size='lg'
            onClick={handleGenerateClick}
          > Generate
          </Button>
          {generatedText && (
          <div>
          {/* <p>
            {generatedText}
          </p> */}
          <div className='rating'>
            <VStack align='left'>
            <HStack>
              <h2> Clarity Rating: </h2>
                <Box bg='#8A0D3C' w='80px' h='75px' p={4} color='white' fontWeight={700}>
                  {/* replace this with variable */}
                  5.0
                </Box>
              <h2> Difficulty Rating: </h2>
                <Box bg='#8A0D3C' w='80px' h='75px' p={4} color='white' fontWeight={700}>
                  {/* replace this with variable */}
                  {generatedText}
                </Box>
            </HStack>
            <br/><br/>
            <HStack>
              <h2> Tags: </h2>
            </HStack>
            <HStack spacing={5}>
              <h2/>
                <Box bg='#8A0D3C' maxW={300} p={4} color='white' fontSize={17} fontWeight={700} borderRadius={20}>
                  {/* replace this with variable */}
                  <div className='tag'>TOUGH GRADER</div>
                </Box>
                <Box bg='#8A0D3C' maxW={300} p={4} color='white' fontSize={17} fontWeight={700} borderRadius={20}>
                  {/* replace this with variable */}
                  <div className='tag'>AMAZING LECTURES</div>
                </Box>
                <Box bg='#8A0D3C' maxW={300} p={4} color='white' fontSize={17} fontWeight={700} borderRadius={20}>
                  {/* replace this with variable */}
                  <div className='tag'>LECTURE HEAVY</div>
                </Box>
            </HStack>
              
            </VStack>
            

          </div>
          </div>
        )}
        <br/>
        <Button
            colorScheme='red'
            size='lg'
            onClick={handleGenerateClick}
          > Post
          </Button>
        </header>
    </ChakraProvider>
  );
}

export default App;
