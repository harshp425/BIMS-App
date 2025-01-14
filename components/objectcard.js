import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import { useRouter } from 'next/navigation';



export default function ActionAreaCard(props) {
  const router = useRouter();

  const handleClick = (e) => {
    sessionStorage.setItem('tool', JSON.stringify(props.object));
    router.push(`/about?q=${props.name}`);
  };
  return (
    <Card sx={{ width: { xs: 280, sm: 230, md: 310 } }}>
      <CardActionArea onClick={handleClick}>
        <CardMedia
          component="img"
          height="140"
          image={props.image === '' || !props.image ? '/images/default.jpg' : props.image}
          alt="image"
          className='h-52'
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {props.name}
          </Typography>

        </CardContent>
      </CardActionArea>
    </Card>
  );
}
