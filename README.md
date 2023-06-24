# OAuthenticity

OAuthenticity is a web-based tool for analyzing GitHub profiles, providing valuable insights into programming languages, commit distribution, and fun facts about users' coding habits. This README provides an overview of the project, its features, and instructions for installation and usage.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Technologies Used](#technologies-used)
- [License](#license)
- [Contributing](#contributing)
- [Acknowledgements](#acknowledgements)
- [Contact](#contact)

## Introduction

OAuthenticity is a play on the terms OAuth and authenticity, emphasizing its focus on providing genuine and insightful information about GitHub users' profiles. The website utilizes Next.js, D3.js, highlight.js, and NextAuth.js to create an interactive and visually appealing interface for data analysis.

## Features

OAuthenticity offers the following key features:

- **Stacked Area Chart**: Visualize a user's programming language usage over time.
- **Pie Chart**: Quickly glance at the overall distribution of programming languages used.
- **Barcode Plot**: Explore the distribution of a user's commits over time and across various repositories.
- **Fun Facts Section**: Discover interesting statistics and patterns about a user's coding habits, including average lines of code per commit, common programming conventions, most active day of the week, and most active time of day.
- **Line Chart**: Display the most active day of the week with inline labels.
- **Bar Chart**: Analyze the distribution of commits over lines of code (LOC).
- **SVG Download**: Easily share charts by downloading them as SVG files.
- **OAuth Authentication**: Authenticate with OAuth to increase your rate limit and view private work.

## Installation

To install and run OAuthenticity locally, please follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/zemetskiym/oauthenticity.git
   ```

2. Navigate to the project directory:

   ```bash
   cd OAuthenticity
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Access the website in your browser at `http://localhost:3000`.

## Usage

1. Visit the OAuthenticity website at `http://localhost:3000` or the deployed URL.
2. Authenticate with your GitHub account using OAuth to increase your rate limit and access private repositories.
3. Enter the GitHub username you wish to analyze.
4. Explore the various charts and sections to gain insights into the user's programming languages and commit patterns.
5. Download charts as SVG files for easy sharing and presentation.

## Technologies Used

OAuthenticity is built using the following technologies and frameworks:

- Next.js
- D3.js
- highlight.js
- NextAuth.js

## License

OAuthenticity is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contributing

We welcome contributions to OAuthenticity! If you find any issues or have ideas for improvements, please submit them as [GitHub Issues](https://github.com/zemetskiym/oauthenticity/issues). Pull requests are also appreciated.

Before contributing, please review our [Contributing Guidelines](CONTRIBUTING.md).

## Acknowledgements

We would like to acknowledge the following resources and libraries that made OAuthenticity possible:

- Next.js: [https://nextjs.org](https://nextjs.org)
- D3.js: [https://d3js.org](https://d3js.org)
- highlight.js: [https://highlightjs.org](https://highlightjs.org)
- NextAuth.js: [https://next-auth.js.org](https://next-auth.js.org)

## Contact

For any inquiries or feedback, please contact us at `oauthenticity@proton.me`.
