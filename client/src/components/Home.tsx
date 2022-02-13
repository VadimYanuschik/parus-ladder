import React from 'react';
import Container from '@mui/material/Container';
import Typography from "@mui/material/Typography";
import {Link as RouterLink} from 'react-router-dom';
import Link from "@mui/material/Link";

const Home = () => {
    return (
        <Container sx={{my: 2}}>
            <img style={{margin: '0 auto', display: 'block', width: '100%', maxWidth: 300}} src="./Chad.png" alt=""/>
            <Typography sx={{mt: 1}} align='center' variant='h4' fontWeight={700}>ParusLadder</Typography>
            <Typography align='center' variant='body1'>Прекрати тратить время на видеоигры с нами!</Typography>
            <Typography sx={{maxWidth: 800, mt: 3}} align='justify' ml='auto' mr='auto' variant='body1'><b>ParusLadder</b> - это русскоязычное сообщество, где можно найти единомышленников, которые так же как и ты бросают видеоигры.
                Здесь ты можешь найти моральную поддержку, полезные статьи и самое главное покрасоваться своей силой воли и воздержанием от видеоигры в “<Link component={RouterLink} to={'/table'}>Таблице лидеров</Link>”</Typography>
        </Container>
    );
};

export default Home;
