<script lang="ts">
	import TemplateProjectCard from './TemplateProjectCard.svelte';

	export let closeModal: () => void;
</script>

<div class="grid h-[500px] grid-cols-1 gap-4 overflow-y-auto text-white">
	<TemplateProjectCard
		thumbnail="https://www.openboardformat.org/previews/communikate-20.png"
		title="CommuniKate 20"
		description="CommuniKate 20 is a functional communication board with 20 buttons per board created by Kate McCallum for the adult population of communicators that she serves."
		creatorName="Kate McCallum"
		projectDownloadLink={'/template-projects/communikate-20.obz'}
		{closeModal}
	/>
	<TemplateProjectCard
		thumbnail="https://www.openboardformat.org/previews/communikate-12.png"
		title="CommuniKate 12"
		description="CommuniKate 12 is a smaller version of CommuniKate 20, it has only 12 buttons per board but offers the same style of layout and functional style of communication."
		creatorName="Kate McCallum"
		projectDownloadLink={'/template-projects/ck12.obz'}
		{closeModal}
	/>
	<TemplateProjectCard
		thumbnail="https://www.openboardformat.org/previews/project-core.png"
		title="Project Core"
		description="Project core is a research-based initiative to ensure all communicators have at least one option for beginning core-base communication."
		creatorName="UNC Chapel Hill"
		projectDownloadLink={'/template-projects/project-core.obf'}
		{closeModal}
	/>
	<TemplateProjectCard
		thumbnail="https://www.openboardformat.org/previews/quick-core-24.png"
		title="Quick Core 24"
		description="Quick Core 24 is a core, motor-planning based vocabulary set with up to 24 buttons per board. It has built-in progression to gradually expand the vocabulary over time."
		creatorName="OpenAAC"
		projectDownloadLink={'/template-projects/quick-core-24.obz'}
		{closeModal}
	/>
	<TemplateProjectCard
		thumbnail="https://s3.amazonaws.com/opensymbols/libraries/extras/quick-core-40.svg"
		title="Quick Core 40"
		description="Quick Core 40 is a core, motor-planning based vocabulary set with up to 40 buttons per board. It has built-in progression to gradually expand the vocabulary over time."
		creatorName="OpenAAC"
		projectDownloadLink={'/template-projects/quick-core-40.obz'}
		{closeModal}
	/>
	<TemplateProjectCard
		thumbnail="https://www.openboardformat.org/previews/quick-core-60.png"
		title="Quick Core 60"
		description="Quick Core 60 is a core, motor-planning based vocabulary set with up to 60 buttons per board. It has built-in progression to gradually expand the vocabulary over time."
		creatorName="OpenAAC"
		projectDownloadLink={'/template-projects/quick-core-60.obz'}
		{closeModal}
	/>
	<TemplateProjectCard
		thumbnail="https://s3.amazonaws.com/opensymbols/libraries/extras/quick-core-84.svg"
		title="Quick Core 84"
		description="Quick Core 84 is a core, motor-planning based vocabulary set with up to 84 buttons per board. It has built-in progression to gradually expand the vocabulary over time."
		creatorName="OpenAAC"
		projectDownloadLink={'/template-projects/quick-core-84.obz'}
		{closeModal}
	/>
	<TemplateProjectCard
		thumbnail="https://www.openboardformat.org/previews/quick-core-112.png"
		title="Quick Core 112"
		description="Quick Core 112 is a core, motor-planning based vocabulary set with up to 112 buttons per board. It has built-in progression to gradually expand the vocabulary over time."
		creatorName="OpenAAC"
		projectDownloadLink={'/template-projects/quick-core-112.obz'}
		{closeModal}
	/>
	<TemplateProjectCard
		thumbnail="https://opensymbols.s3.amazonaws.com/libraries/extras/vocal-flair-24.svg"
		title="Vocal Flair 24"
		description="Vocal Flair 24 is a core, flat-but-dynamic-styled vocabulary set with up to 24 buttons per board. It has built-in progression to gradually expand the vocabulary over time."
		creatorName="OpenAAC"
		projectDownloadLink={'/template-projects/vocal-flair-24.obz'}
		{closeModal}
	/>
	<TemplateProjectCard
		thumbnail="https://opensymbols.s3.amazonaws.com/libraries/extras/vocal-flair-40.svg"
		title="Vocal Flair 40"
		description="Vocal Flair 40 is a core, flat-but-dynamic-styled vocabulary set with up to 40 buttons per board. It has built-in progression to gradually expand the vocabulary over time."
		creatorName="OpenAAC"
		projectDownloadLink={'/template-projects/vocal-flair-40.obz'}
		{closeModal}
	/>
	<TemplateProjectCard
		thumbnail="https://opensymbols.s3.amazonaws.com/libraries/extras/vocal-flair-60.svg"
		title="Vocal Flair 60"
		description="Vocal Flair 60 is a core, flat-but-dynamic-styled vocabulary set with up to 60 buttons per board. It has built-in progression to gradually expand the vocabulary over time."
		creatorName="OpenAAC"
		projectDownloadLink={'/template-projects/vocal-flair-60.obz'}
		{closeModal}
	/>
	<TemplateProjectCard
		thumbnail="https://opensymbols.s3.amazonaws.com/libraries/extras/vocal-flair-84.svg"
		title="Vocal Flair 84"
		description="Vocal Flair 84 is a core, flat-but-dynamic-styled vocabulary set with up to 84 buttons per board. It has built-in progression to gradually expand the vocabulary over time."
		creatorName="OpenAAC"
		projectDownloadLink={'/template-projects/vocal-flair-84.obz'}
		{closeModal}
	/>
	<TemplateProjectCard
		thumbnail="https://opensymbols.s3.amazonaws.com/libraries/extras/vocal-flair-84.svg"
		title="Vocal Flair 84 - With Keyboard"
		description="Vocal Flair 84 is a core, flat-but-dynamic-styled vocabulary set with up to 84 buttons per board, including a keyboard on the main board. It has built-in progression to gradually expand the vocabulary over time."
		creatorName="OpenAAC"
		projectDownloadLink={'/template-projects/vocal-flair-84-with-keyboard.obz'}
		{closeModal}
	/>
	<TemplateProjectCard
		thumbnail="https://opensymbols.s3.amazonaws.com/libraries/extras/vocal-flair-112.svg"
		title="Vocal Flair 112"
		description="Vocal Flair 112 is a core, flat-but-dynamic-styled vocabulary set with up to 112 buttons per board, including a keyboard on the main board. It has built-in progression to gradually expand the vocabulary over time."
		creatorName="OpenAAC"
		projectDownloadLink={'/template-projects/vocal-flair-112.obz'}
		{closeModal}
	/>
	<TemplateProjectCard
		thumbnail="https://opensymbols.s3.amazonaws.com/libraries/extras/sequoia-15.svg"
		title="Sequoia 15"
		description="Sequoia-15 is a branching vocabulary set, built in an effort to support communication organized by pragmatic function but with the goal of encouraging expansion into generalized and core-oriented vocabulary."
		creatorName="OpenAAC"
		projectDownloadLink={'/template-projects/sequoia-15.obz'}
		{closeModal}
	/>
</div>
