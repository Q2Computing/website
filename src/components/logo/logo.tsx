import { component$ } from '@builder.io/qwik';
import ImgQ2Icon from '../../../media/icon.png?jsx'

export default component$(() => {
  return (
    <a href="/" title="Q2-Computing Home" class="inline-block">
      <ImgQ2Icon alt="Q2-Computing Logo" />
    </a>
  );
});