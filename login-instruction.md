#playwright create a new test file named 'login.spec.js'.

This file should test the login functionality at 'http://localhost:3000'. Group all tests within a test.describe block named 'Login form validation'. Before each test, navigate to the page.

Create two test cases:

Test 1: 'should allow a user to log in successfully'

1. Find the input with the label 'Username' and fill it with 'admin'.
2. Find the input with the label 'Password' and fill it with '123'.
3. Click the button with the name 'Login'.
4. Assert that the final URL is 'http://localhost:3000/welcome'.

Test 2: 'should show an error message with incorrect credentials'

1. Find the input with the label 'Username' and fill it with 'admin'.
2. Find the input with the label 'Password' and fill it with '1234'.
3. Click the button with the name 'Login'.
4. Assert that the text "Username or password is incorrect!" is visible on the page.
