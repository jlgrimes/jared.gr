import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface ProjectProps {
  title: string;
  year: string;
  description: string;
  image: string;
}

export const Project = ({ title, year, description, image }: ProjectProps) => {
  return (
    <Card className='overflow-hidden'>
      <div className='w-full h-48 relative'>
        <Image
          src={`/assets/${image}`}
          alt={title}
          fill
          className='object-cover'
        />
      </div>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{year}</p>
      </CardContent>
    </Card>
  );
};
