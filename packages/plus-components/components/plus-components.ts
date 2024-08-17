import type { App, Plugin } from 'vue';
import PlusTable from './table';
import PlusField from './field';
import PlusForm from './form';

const components: Record<string, Plugin> ={
  PlusTable,
  PlusField,
  PlusForm,
}

const install = (app: App) => {
  for (const key of Object.keys(components)) {
    app.use(components[key]);
  }
};

const PlusComponents = {
  ...components,
  install
}

export default PlusComponents