import { children, Component } from 'solid-js';
import { AppHeader } from '../components/AppHeader';

interface IAppLayoutProps {
  children: Element | any;
} 

export const AppLayout: Component<IAppLayoutProps> = (props) => {
  const c = children(() => props.children);
  return (
    <>
      <AppHeader />
      {c()}
    </>
  );
};