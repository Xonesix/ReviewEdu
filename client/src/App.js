import logo from './ReviewEd.png'
import './App.css';
import { ChakraProvider, Input } from '@chakra-ui/react';
import { Textarea, Button, Box, HStack, VStack, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react'
import {useState, useEffect} from 'react';

const professors = [
  "Sridhar Alagar",
  "Rawan Alghofaili",
  "Gordon Leslie Arnold",
  "Farokh B. Bastani",
  "Eric Becker",
  "Sergey Bereg",
  "Mehra Borazjany",
  "Ebru Cankaya",
  "R. Chandrasekaran",
  "Feng Chen",
  "Zhiyu Chen",
  "Anjum Chida",
  "Wei-Pang Chin",
  "Bhadrachalam Chitturi",
  "Michael Christiansen",
  "Lawrence Chung",
  "Jorge A. Cobb",
  "John Cole",
  "Ovidiu Daescu",
  "Chris Irwin Davis",
  "Milind Dawande",
  "Partha De",
  "Doug DeGroot",
  "Yvo Desmedt",
  "Yi Ding",
  "Scott Dollinger",
  "Karen Doore",
  "Ding-Zhu Du",
  "Xinya Du",
  "Serdar Erbatur",
  "Tim Farage",
  "András Faragó",
  "Ranran Feng",
  "Paul Fishwick",
  "Emily Kyle Fox",
  "Daniel Gibney",
  "Vibhav Gogate",
  "Xiaohu Guo",
  "Yunhui Guo",
  "Gopal Gupta",
  "Neeraj Gupta",
  "Zygmunt Haas",
  "Omar Hamdy",
  "Kevin Hamlen",
  "Shuang Hao",
  "Sanda Harabagiu",
  "D.T. Huynh",
  "Rishabh Iyer",
  "Kangkook Jee",
  "Jason Jue",
  "Murat Kantarcioglu",
  "Gity Karami",
  "Shyam Karrah",
  "Kamran Khan",
  "Latifur Khan",
  "Chung Hwan Kim",
  "Jin Ryong Kim",
  "Pushpa Kumar",
  "Bingzhe Li",
  "Khiem Le",
  "Andrian Marcus",
  "Karen Mazidi",
  "Richard Min",
  "Neeraj Mittal",
  "Dan Moldovan",
  "Anurag Nagar",
  "Priya Narayanasami",
  "Sriraam Natarajan",
  "Vincent Ng",
  "Nhut Nguyen",
  "Tien Nguyen",
  "Simeon Ntafos",
  "Jalal Omer",
  "Jessica Ouyang",
  "Greg Ozbirn",
  "Ivor P. Page",
  "Mark C. Paulk",
  "William Pervin",
  "B. Prabhakaran",
  "Ravi Prakash",
  "Balaji Raghavachari",
  "Benjamin Raichel",
  "Miguel Razo Razo",
  "Brian Ricks",
  "Nicholas Ruozzi",
  "Elmer Salazar",
  "Kamil Sarac",
  "Meghana Satpute",
  "Haim Schweitzer",
  "Jason Smith",
  "Nidhiben Solanki",
  "Srimathi Srinivasan",
  "Ivan Sudborough",
  "Bhavani Thuraisingham",
  "Laurie Thompson",
  "Yapeng Tian",
  "Klaus Truemper",
  "Jey Veerasamy",
  "S. Venkatesan",
  "Xinda Wang",
  "Shiyi Wei",
  "James Willson",
  "W. Eric Wong",
  "Weili Wu",
  "Yu Xiang",
  "Wei Yang",
  "I-Ling Yen",
  "Nurcan Yuruk",
  "Rym Zalila-Wenkstern",
  "Kang Zhang",
  "Yi Zhao",
];

function App() {
  let [review, setReview] = useState('')
  let [generatedText, setGeneratedText] = useState('')
  let [difficulty, setDifficulty] = useState('')
  let [clarity, setClarity] = useState('')
  let [tags, setTags] = useState('')
  const [searchTerm, setSearchTerm] = useState('');
  const [currentProfessor, setCurrentProfessor] = useState('');

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
  }

  const handleProfessorClick = (professor) => {
    setCurrentProfessor(professor);
  };

  const matchingProfessors = professors.filter((professor) =>
    professor.toLowerCase().includes(searchTerm)
  );

  

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
      console.log('Data: ', data);
      setClarity(data.clarity);
      setDifficulty(data.difficulty);
      setTags(data.tags);

      console.log('Clarity:', data.clarity);
      console.log('Difficulty:', data.difficulty);
      console.log('Tags', data.tags)
    } catch (error) {
      console.log("Error: ", error);
    }
  }


  return (
    <ChakraProvider>
        <header className="App-header">
          <Box p={4}>
            <img src={logo} alt="Logo" width='5%'/>
          </Box>
          <br/>
          <HStack>
          <h2> Choose a Professor to Review: </h2>

        <Input
          type="text"
          placeholder="Search for a professor..."
          value={searchTerm}
          onChange={handleSearch}
          bgColor='#8A0D3C'
          width='50%'
        />
        </HStack>

        {/* Display matching professors directly under the search bar */}
        {searchTerm && (
          <VStack align="left" mt={2} maxH="100px" overflowY="auto">
            {matchingProfessors.map((professor, index) => (
              <Box key={index} color="black" borderRadius="md" mb={2} onClick={() => handleProfessorClick(professor)}>
                <div className='search'>{professor}</div>
              </Box>
            ))}
          </VStack> )}
          {currentProfessor && (
            <h1> Your Review for {currentProfessor} </h1>
          )}
          
          {!currentProfessor && (
            <h1> Your Overall UTD Review </h1>
          )}
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
            bgColor='#CB4154'
            color='white'
            size='lg'
            onClick={handleGenerateClick}
          > Generate
          </Button>

          {clarity && (
          <div>

          <div className='rating'>
            <VStack align='left'>
            <HStack>
              <h2> Clarity Rating: </h2>
                <Box bg='#8A0D3C' w='80px' h='75px' p={4} color='white' fontWeight={700}>
                  {/* replace this with variable */}
                  {clarity}
                </Box>
              <h2> Difficulty Rating: </h2>
                <Box bg='#8A0D3C' w='80px' h='75px' p={4} color='white' fontWeight={700}>
                  {/* replace this with variable */}
                  {difficulty}
                </Box>
            </HStack>
            <br/><br/>
            <HStack>
              <h2> Tags: </h2>
            </HStack>
            <HStack spacing={5}>
              <h2/>
              {tags.map((tag, index) => (
                    <Box
                      key={index}
                      bg='#8A0D3C'
                      maxW={300}
                      p={4}
                      color='white'
                      fontSize={17}
                      fontWeight={700}
                      borderRadius={20}
                    >
                      {tag}
                    </Box>
                  ))}
            </HStack>
              
            </VStack>
            

          </div>
          </div>
        )}
        <br/>
        <Button
            bgColor='#CB4154'
            color='white'
            size='lg'
            onClick={handleGenerateClick}
          > Post
          </Button> <br/> <br/>
        </header>
    </ChakraProvider>
  );
}

export default App;
