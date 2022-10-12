<script>
	import './app.css';
	import { Me } from '$lib/client/stores';

	export let data;

	$Me = data.user;
</script>

<slot><!-- optional fallback --></slot>
