'use client';

import { Project } from './Project';
import { siteData } from '../../../lib/data';
import Masonry from 'react-masonry-css';
import { InView } from '@/components/motion-primitives/in-view';

const breakpointColumns = {
  default: 3,
  1024: 2,
  768: 1,
};

export const Projects = () => {
  const projects = [...siteData.projects].sort((a, b) => b.year - a.year);

  return (
    <InView
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.4 }}
      viewOptions={{ margin: '0px 0px -100px 0px' }}
      once
    >
      <section className='py-12'>
        <Masonry
          breakpointCols={breakpointColumns}
          className='flex w-auto'
          columnClassName='bg-clip-padding'
        >
          {projects.map(project => (
            <Project
              key={project.title}
              title={project.title}
              company={project.company}
              year={project.year}
              content={project.content}
              image={project.image}
              url={project.url}
              infoUrl={project.infoUrl}
            />
          ))}
        </Masonry>
      </section>
    </InView>
  );
};
