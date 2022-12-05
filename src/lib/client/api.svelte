<script lang="ts" context="module">
  import { Loading, EditModeData } from "../../lib/client/stores";

  export const saveAllTiles = async () => {
    let TileEditQueueVal = {};
    let editData = {};

    EditModeData.subscribe((val) => {
      TileEditQueueVal = val.queue;
      editData = val;
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
    //@ts-ignore
    if (data.success) EditModeData.set({ ...editData, queue: {} });
    Loading.set(false);
  };

  export const url2base64 = async (url: string) => {
    return await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = () => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result);
        };
        reader.readAsDataURL(xhr.response);
      };
      xhr.open("GET", url);
      xhr.responseType = "blob";
      xhr.send();
    });
  };
</script>
