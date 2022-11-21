<script lang="ts">
  import { Me } from "../lib/stores";
  export let _Me: any = null;
  if (_Me) {
    $Me = _Me;
  }
</script>
