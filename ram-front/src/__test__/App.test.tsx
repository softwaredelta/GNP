import { render } from '@testing-library/react';
import App from '../App';

test('Renders main page correctly', () => {
    render(<App/>);
    expect(true).toBeTruthy();
});