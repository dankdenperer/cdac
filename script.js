const apiKey = '53a8c500-636a-11ef-b1a2-2745557494ce';
const apiUrl = `https://app.zenserp.com/api/v2/search?apikey=${apiKey}`;

let debounceTimer;
const debounceDelay = 300; // 300 milliseconds
const cache = {};

// Debounced performSearch function
function debouncedPerformSearch() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        performSearch();
    }, debounceDelay);
}

// Perform the search request to Zenserp API
async function performSearch() {
    const query = document.getElementById('searchInput').value;
    if (!query) {
        alert('Please enter a search term.');
        return;
    }

    if (cache[query]) {
        console.log('Using cached data');
        displayResults(cache[query]);
        displayKnowledgeGraph(cache[query]);
        return;
    }

    const searchUrl = `${apiUrl}&q=${encodeURIComponent(query)}&search_engine=google.com`;

    try {
        const response = await fetch(searchUrl);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        console.log('API Response:', data); // Debugging line
        cache[query] = data;
        displayResults(data);
        displayKnowledgeGraph(data);
    } catch (error) {
        console.error('Error fetching search results:', error);
        alert('Failed to fetch search results. Please try again later.');
    }
}

// Function to display search results
function displayResults(data) {
    const resultsContainer = document.getElementById('resultsContainer');
    resultsContainer.innerHTML = '';

    if (data && data.organic && data.organic.length > 0) {
        data.organic.forEach(item => {
            const resultElement = document.createElement('div');
            resultElement.className = 'results-item';
            resultElement.innerHTML = `
                <a href="${item.url}" target="_blank">${item.title}</a>
                <p>${item.description}</p>
            `;
            resultsContainer.appendChild(resultElement);
        });
    } else {
        resultsContainer.innerHTML = '<p>No results found.</p>';
    }
}

// Function to display knowledge graph data
function displayKnowledgeGraph(data) {
    const knowledgeGraphContainer = document.getElementById('knowledgeGraphContainer');
    knowledgeGraphContainer.innerHTML = '';

    if (data && data.knowledge_graph && data.knowledge_graph.length > 0) {
        data.knowledge_graph.forEach(item => {
            const graphElement = document.createElement('div');
            graphElement.className = 'knowledge-graph-item';
            graphElement.innerHTML = `
                <h2>${item.title}</h2>
                <p><strong>Subtitle:</strong> ${item.subtitle}</p>
                <p><strong>Description:</strong> ${item.description}</p>
                <p><strong>Author:</strong> ${item.author}</p>
                <p><strong>Published:</strong> ${item.published}</p>
                <p><strong>Book Preview:</strong> ${item.google_books_preview}</p>
                <p><strong>Thumbs Up:</strong> ${item.thumbs_up}</p>
                <p><strong>Get Book Actions:</strong> ${item.get_book_actions}</p>
                <p><strong>User Reviews:</strong> ${item.user_reviews}</p>
            `;
            knowledgeGraphContainer.appendChild(graphElement);
        });
    } else {
        knowledgeGraphContainer.innerHTML = '<p>No knowledge graph data found.</p>';
    }
}

// Attach the debounced function to the input event
document.getElementById('searchInput').addEventListener('input', debouncedPerformSearch);

// Attach the performSearch function to the button click event
document.getElementById('searchButton').addEventListener('click', performSearch);

// Optional: Trigger search when Enter key is pressed
document.getElementById('searchInput').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        performSearch();
    }
});
