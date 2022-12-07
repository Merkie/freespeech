<script lang="ts">
  import { Me } from "../lib/client/stores";
  export let _Me: any = null;
  if (_Me.email) {
    $Me = _Me;
  }
</script>
