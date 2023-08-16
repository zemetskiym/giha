import '@testing-library/jest-dom/extend-expect';
import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Sidebar from "../../../src/components/dashboard/Sidebar";
import { DarkModeProvider } from '../../../src/components/darkModeContext';
import { useSession } from "next-auth/react";
jest.mock("next-auth/react");

// Define the types for the React state and state setter
type ActiveViewType = string;
type SetActiveViewType = React.Dispatch<React.SetStateAction<ActiveViewType>>;

describe("Sidebar Component", () => {

    // Mock state and state setter
    let mockActiveView: ActiveViewType;
    let mockSetActiveView: SetActiveViewType;

    beforeEach(() => {
        mockActiveView = 'dashboard';
        mockSetActiveView = jest.fn();

        // Mock useSession with no session value
        (useSession as jest.Mock).mockReturnValue([false, false]);

        // Render the Sidebar component
        render(
            <MemoryRouter>
                <DarkModeProvider>
                    <Sidebar activeView={mockActiveView} setActiveView={mockSetActiveView} />
                </DarkModeProvider>
            </MemoryRouter> 
        );
    });

    it('should redirect to "/" when the home button is clicked', () => {
        // Get the home button by test ID
        const homeButton = screen.getByTestId('home');

        // Click the home button
        fireEvent.click(homeButton);

        // Check if the URL has changed to "/"
        expect(window.location.pathname).toBe('/');
    });

    it('should change activeView state when the analysis button is clicked', () => {
        const analysisButton = screen.getByTestId('analysis');

        fireEvent.click(analysisButton);

        // Check if the React state setter function was called as expected
        expect(mockSetActiveView).toHaveBeenCalledWith('analysis');
    });

    it('should link to the Github new issue page with an issue button', () => {
        const issueButton = screen.getByTestId('issue');

        // Check if window.open was called with the expected URL
        expect(issueButton).toHaveAttribute('href', 'https://github.com/zemetskiym/giha/issues/new/choose');
    });

    it('should link to the Github repository page with a repository button', () => {
        const repositoryButton = screen.getByTestId('repository');

        // Check if window.open was called with the expected URL
        expect(repositoryButton).toHaveAttribute('href', 'https://github.com/zemetskiym/giha');
    });

    it('should link to the Github license page with a license button', () => {
        const licenseButton = screen.getByTestId('license');

        // Check if window.open was called with the expected URL
        expect(licenseButton).toHaveAttribute('href', 'https://github.com/zemetskiym/giha/blob/main/LICENSE');
    });

    it('should change the dark mode state when the dark mode button is clicked', () => {
        const darkModeButton = screen.getByTestId('dark-mode-button');

        fireEvent.click(darkModeButton);

        waitFor(() => {
            const darkModeIcon = screen.getByTestId('dark-mode-icon');

            // Assert that the dark mode icon appears after clicking the button, indicating a state change
            expect(darkModeIcon).toBeInTheDocument();
        });
    }); 

    it('should link to the Github mailto email with the email button', () => {
        const emailButton = screen.getByTestId('email');

        // Check if window.open was called with the expected URL
        expect(emailButton).toHaveAttribute('href', 'mailto:gihanalysis@proton.me');
    });

    it('should open a popout with a signout button when the profile menu button is clicked', () => {
        // Get the profile menu button by test ID
        const profileMenu = screen.getByTestId('profile-menu');

        // Click the profile menu button
        fireEvent.click(profileMenu);
    
        // Check if the signout button exists
        waitFor(() => {        
            const signout = screen.getByTestId('profile-menu-signout');
            expect(signout).toBeInTheDocument();
        });
    });

});
