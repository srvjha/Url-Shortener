import axios from 'axios';

const { VITE_GEMINI_API_ENDPOINT: apiEndpoint, VITE_GEMINI_API_KEY: apiKey } = import.meta.env;

export async function detectSpammedUrl(url) {
    try {
        const response = await axios.post(apiEndpoint, {
            prompt: `Is the URL "${url}" considered spam?`, // Make sure this matches the expected prompt format for your API
            temperature: 0.7, // Adjust this as necessary based on your needs
        }, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            }
        });

        const generatedText = response.data.generated_text;
        console.log(generatedText); // Log the AI's response for debugging

        // Parse the response to determine if the URL is spam
        if (generatedText.toLowerCase().includes('spam')) {
            console.log('URL is likely spammed.');
            return true;
        } else {
            console.log('URL is not likely spammed.');
            return false;
        }
    } catch (error) {
        console.error('Error:', error);
        return false; // Return false when there's an error
    }
}
