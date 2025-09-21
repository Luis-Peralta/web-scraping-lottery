# Web Scraping Lottery

[![Pipeline GitHub](https://github.com/Luis-Peralta/web-scraping-lottery/actions/workflows/github-action.yml/badge.svg)](https://github.com/Luis-Peralta/web-scraping-lottery/actions/workflows/github-action.yml)

## Project Overview

**Web Scraping Lottery** is an automated Node.js project designed to extract lottery results from the web, analyze them using AI, and deliver insights and lucky numbers via WhatsApp. It leverages Puppeteer for web scraping, MongoDB for data storage, Google Gemini AI for analysis, and Twilio for messaging. The pipeline is scheduled to run on Tuesdays, Thursdays, and Saturdays.

**Main Features:**
- Automated web scraping of lottery results
- Data storage in MongoDB
- AI-powered statistical analysis and predictions
- WhatsApp notifications with lucky numbers or AI analysis
- Modular, extensible codebase

---

## Project Structure

```
web-scraping-lottery/
│
├── script/
│   ├── aiAnalysis.js         # Runs AI analysis on lottery data
│   ├── extractAll.js         # Scrapes lottery results from the web
│   ├── luckyNumbers.js       # Generates random lucky numbers
│   ├── sendMsg.js            # Sends WhatsApp messages with results
│   ├── services/
│   │   ├── geminiConnection.js   # Handles Google Gemini AI API calls
│   │   └── mongoConnection.js    # Manages MongoDB connections and queries
│   └── utils/
│       └── prompts.js            # Stores AI prompt templates
│
├── package.json             # Project metadata and dependencies
├── jsconfig.json            # JS project configuration
├── eslint.config.mjs        # ESLint configuration for code quality
├── readme.md                # Project documentation
```

---

## Installation Instructions

1. **Clone the repository:**
	 ```sh
	 git clone https://github.com/Luis-Peralta/web-scraping-lottery.git
	 cd web-scraping-lottery
	 ```

2. **Install dependencies:**
	 ```sh
	 npm install
	 ```

3. **Set up environment variables:**
	 - Create a `.env` file in the root directory with the following variables:
		 ```
		 URL=<target_lottery_url>
		 DB_URI=<your_mongodb_uri>
		 DB_NAME=<your_db_name>
		 COLLECTION=<your_collection_name>
		 GEMINI_API_KEY=<your_gemini_api_key>
		 TWILIO_ACCOUNT_SID=<your_twilio_sid>
		 TWILIO_AUTH_TOKEN=<your_twilio_auth_token>
		 FROM_NUMBER=<your_twilio_whatsapp_number>
		 TO_NUMBER=<recipient_whatsapp_number>
		 SEND_AI_ANALYSIS=true
		 ALL_DATA=false
		 ```

4. **(Optional) Run ESLint to check code quality:**
	 ```sh
	 npm run eslint
	 ```

---

## Usage Instructions

- **Scrape and store lottery data:**
	```sh
	npm run data
	```

- **Send WhatsApp message with lucky numbers or AI analysis:**
	```sh
	npm run lucky
	```

- **Fix vulnerabilities:**
	```sh
	npm run auditFix
	```

- **Customize prompts or AI analysis:**
	- Edit `script/utils/prompts.js` to adjust AI instructions.

---

## Contributing Guidelines

- **Branch Naming:**  
	Use the format: `type_issueId_short-description`  
	Examples:  
	- `bug_123_button_doesnt_work`
	- `enhancement_45_add_ai_analysis`
	- `documentation_10_update_readme`

- **Code Style:**  
	- Follow ESLint rules (`eslint.config.mjs`)
	- Use 2 spaces for indentation, single quotes, and semicolons

- **Pull Requests:**  
	- Create a new branch for each feature or fix
	- Write clear, descriptive commit messages
	- Reference related issues in PRs
	- Ensure code passes linting and tests before submitting

---

## GitHub Best Practices

- **Branching Strategy:**  
	- `main`: Production-ready code  
	- `enhancement`, `bug`, `documentation`: Feature/fix branches

- **Commit Messages:**  
	- Use imperative mood (e.g., "Add AI analysis module")
	- Reference issues where applicable

- **Pull Request Workflow:**  
	- Open PRs against `main`
	- Request reviews from maintainers
	- Address review comments promptly

- **Code Reviews:**  
	- Review for clarity, maintainability, and adherence to style
	- Suggest improvements and ask questions

---

## License and Acknowledgements

- **License:** ISC
- **Acknowledgements:**  
	- [Puppeteer](https://github.com/puppeteer/puppeteer)
	- [MongoDB](https://www.mongodb.com/)
	- [Google Gemini AI](https://ai.google.dev/)
	- [Twilio](https://www.twilio.com/)

---

Feel free to further customize this README to fit your project's evolving needs!