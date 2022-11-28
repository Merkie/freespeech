<script lang="ts" context="module">
  import { Loading, TileEditQueue } from "../../lib/client/stores";

  export const saveAllTiles = async () => {
    let TileEditQueueVal = {};

    TileEditQueue.subscribe((val) => {
      TileEditQueueVal = val;
    });
    Loading.set(true);

    const response = await fetch("/api/v1/tile/edit.json", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tiles: Object.values(TileEditQueueVal),
      }),
    });
    const data = await response.json();
    if (data.success) TileEditQueue.set(false);
    Loading.set(false);
  };
</script>
