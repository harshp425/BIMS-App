import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";

export default function ActionAreaCard({ name, image, object, onEdit, onDelete }) {
  const router = useRouter();

  const handleCardClick = () => {
    sessionStorage.setItem('tool', JSON.stringify(object));
    router.push(`/about?q=${name}`);
  };

  return (
    <Card sx={{ width: { xs: 280, sm: 230, md: 310 } }}>
      <CardActionArea onClick={handleCardClick}>
        <CardMedia
          component="img"
          height="140"
          image={image === '' || !image ? '/images/default.jpg' : image}
          alt="image"
          className="h-52"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {name}
          </Typography>
        </CardContent>
      </CardActionArea>
      <div className="flex justify-between mt-4 p-4">
        <Button
          className="bg-blue-500 hover:opacity-75 transition-opacity duration-200 text-white px-4 py-2 rounded"
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
        >
          Edit
        </Button>
        <Button
          className="bg-red-500 hover:opacity-75 transition-opacity duration-200 text-white px-4 py-2 rounded"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          Delete
        </Button>
      </div>
    </Card>
  );
}
