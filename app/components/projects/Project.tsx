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
  description: string;
  content: string;
  image: string;
}

export const Project = ({
  title,
  description,
  content,
  image,
}: ProjectProps) => {
  return (
    <Card className='overflow-hidden shadow-md flex flex-col pt-0 h-full'>
      <div className='h-40 relative -mt-px -ml-px -mr-px'>
        <Image
          src={`/assets/${image}`}
          alt={title}
          fill
          className='object-cover rounded-t-xl pb-2'
        />
      </div>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{content}</CardContent>
    </Card>
  );
};
