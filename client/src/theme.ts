import { createTheme } from '@material-ui/core/styles';


const palette = {
    primary: { main: '#222222' },
    secondary: { main: '#f50057' }
};

const typography = {
    fontFamily: 'Playfair Display',
    h4: {
        color: '#222222'
    },
    body1: {
        color: '#222222'
    }
}

export default createTheme({ palette, typography });