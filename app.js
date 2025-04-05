// Get DOM elements
const problemTypeDropdown = document.getElementById('problemType');
const questionsDiv = document.getElementById('questions');
const submitBtn = document.getElementById('submitBtn');
const resultDiv = document.getElementById('result');
const algorithmText = document.getElementById('algorithm');

// Function to display questions based on the selected problem
function displayQuestions() {
  const problemType = problemTypeDropdown.value;
  questionsDiv.innerHTML = ''; // Clear previous questions

  if (problemType === 'search') {
    questionsDiv.innerHTML = `
      <p>Is the data sorted?</p>
      <select id="isSorted">
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </select>
    `;
  } else if (problemType === 'sort') {
    questionsDiv.innerHTML = `
      <p>What is the size of the data?</p>
      <select id="dataSize">
        <option value="small">Small (less than 1000 elements)</option>
        <option value="large">Large (more than 1000 elements)</option>
      </select>
    `;
  } else if (problemType === 'shortestPath') {
    questionsDiv.innerHTML = `
      <p>Is the graph weighted?</p>
      <select id="isWeighted">
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </select>
    `;
  } else if (problemType === 'dp') {
    questionsDiv.innerHTML = `
      <p>Is this problem a classical DP problem?</p>
      <select id="isClassicalDP">
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </select>
    `;
  }
}

// Function to determine the recommended algorithm based on answers
function getAlgorithm() {
  const problemType = problemTypeDropdown.value;
  let algorithm = '';
  let additionalData = '';

  if (problemType === 'search') {
    const isSorted = document.getElementById('isSorted').value;
    algorithm = isSorted === 'yes' ? 'Binary Search' : 'Linear Search';
    additionalData = `Is Sorted: ${isSorted}`;
  } else if (problemType === 'sort') {
    const dataSize = document.getElementById('dataSize').value;
    algorithm = dataSize === 'small' ? 'Insertion Sort' : 'Merge Sort';
    additionalData = `Data Size: ${dataSize}`;
  } else if (problemType === 'shortestPath') {
    const isWeighted = document.getElementById('isWeighted').value;
    algorithm = isWeighted === 'yes' ? 'Dijkstra\'s Algorithm' : 'Breadth-First Search';
    additionalData = `Is Weighted: ${isWeighted}`;
  } else if (problemType === 'dp') {
    const isClassicalDP = document.getElementById('isClassicalDP').value;
    algorithm = isClassicalDP === 'yes' ? 'Knapsack Problem' : 'Matrix Chain Multiplication';
    additionalData = `Classical DP: ${isClassicalDP}`;
  }

  // Show result
  algorithmText.innerText = algorithm;
  resultDiv.classList.remove('hidden');

  // Save the result to the database
  saveToDatabase(problemType, algorithm, additionalData);
}

// Function to send data to the backend API
function saveToDatabase(problemType, algorithm, additionalData) {
  fetch('/api/algorithms', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: algorithm,
      description: `Recommended algorithm for ${problemType}.`,
      time_complexity: 'TBD', // Replace with actual time complexity if needed
      space_complexity: 'TBD', // Replace with actual space complexity if needed
      example_code: 'Example code will go here.', // Replace with real code if available
      category: problemType,
    }),
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to save data to the database');
      }
      return response.json();
    })
    .then(data => {
      console.log('Data saved successfully:', data);
    })
    .catch(err => {
      console.error('Error saving data:', err);
    });
}

// Event Listeners
problemTypeDropdown.addEventListener('change', displayQuestions);
submitBtn.addEventListener('click', getAlgorithm);

// Initial display
displayQuestions();
