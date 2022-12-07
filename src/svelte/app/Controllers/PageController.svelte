<script context="module" lang="ts">
  import { PageData } from "../../../lib/client/stores";

  let pageData: {
    history: string[];
    index: number;
  };
  PageData.subscribe((value) => {
    pageData = value;
  });

  const navigateTo = (pageName: string) => {
    PageData.update((data) => ({
      history: [...data.history, pageName],
      index: data.index + 1,
    }));
  };

  const navigateBack = () => {
    // test if we can go back
    if (pageData.index > 0) {
      PageData.update((data) => ({
        history: data.history.slice(0, data.index),
        index: data.index - 1,
      }));
    }
  };

  const navigateForward = () => {
    // test if we can go forward
    if (pageData.index < pageData.history.length - 1) {
      PageData.update((data) => ({
        history: data.history,
        index: data.index + 1,
      }));
    }
  };
</script>
