import type { Component } from 'solid-js';
import { AppLayout } from '../layouts/AppLayout';

const About: Component = () => {
  return (
    <AppLayout>
      <p>What's up?! This is the about page!</p>
    </AppLayout>
  );
};

export default About;
