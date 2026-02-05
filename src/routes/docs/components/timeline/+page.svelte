<script lang="ts">
	import * as DocPage from '$lib/components/feature/doc-page';
	import * as Timeline from '$lib/components/ui/timeline';
	import {
		Rocket,
		GitCommit,
		AlertCircle,
		Truck,
		MapPin,
		Package,
		CheckCircle2
	} from 'lucide-svelte';
</script>

<DocPage.Root>
	<DocPage.Header>
		<DocPage.Title>Timeline</DocPage.Title>
		<DocPage.Description>
			A vertical list of events, milestones, or history logs.
		</DocPage.Description>
	</DocPage.Header>

	<DocPage.Content>
		<DocPage.Example>
			<DocPage.Preview class="p-10 flex justify-start">
				<Timeline.Root>
					<Timeline.Item>
						<Timeline.Separator />
						<Timeline.Content>
							<Timeline.Date>August 2024</Timeline.Date>
							<Timeline.Title>Application Submitted</Timeline.Title>
							<Timeline.Description>
								We have received your application and it is currently under review.
							</Timeline.Description>
						</Timeline.Content>
					</Timeline.Item>

					<Timeline.Item>
						<Timeline.Separator>
							<div class="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
						</Timeline.Separator>
						<Timeline.Content>
							<Timeline.Date>September 2024</Timeline.Date>
							<Timeline.Title>Interview Scheduled</Timeline.Title>
							<Timeline.Description>
								A recruiter has reached out to schedule a technical screening.
							</Timeline.Description>
						</Timeline.Content>
					</Timeline.Item>

					<Timeline.Item>
						<Timeline.Separator />
						<Timeline.Content>
							<Timeline.Date>October 2024</Timeline.Date>
							<Timeline.Title>Final Decision</Timeline.Title>
							<Timeline.Description>
								Pending final approval from the hiring committee.
							</Timeline.Description>
						</Timeline.Content>
					</Timeline.Item>
				</Timeline.Root>
			</DocPage.Preview>
			<DocPage.Code
				code={`<Timeline.Root>
  <Timeline.Item>
    <Timeline.Separator />
    <Timeline.Content>
       <Timeline.Date>Aug 2024</Timeline.Date>
       <Timeline.Title>Event</Timeline.Title>
       <Timeline.Description>Details...</Timeline.Description>
    </Timeline.Content>
  </Timeline.Item>
</Timeline.Root>`}
			/>
		</DocPage.Example>

		<DocPage.Heading>Installation</DocPage.Heading>
		{@const componentName = 'timeline'}
		<DocPage.Text
			>Run the following command to install the `{componentName}` components:</DocPage.Text
		>
		<DocPage.PM
			command="execute"
			args={[
				'shadcn-svelte@latest',
				'add',
				'https://more-shadcn.noair.fun/r/' + componentName + '.json'
			]}
		/>

		<DocPage.Heading>Custom Icons</DocPage.Heading>
		<DocPage.Example>
			<DocPage.Preview class="p-10 flex justify-start">
				<Timeline.Root>
					<Timeline.Item>
						<Timeline.Separator class="bg-primary text-primary-foreground border-primary">
							<Rocket class="h-3 w-3" />
						</Timeline.Separator>
						<Timeline.Content>
							<Timeline.Title>v2.0 Released</Timeline.Title>
							<Timeline.Description>Major update with new features.</Timeline.Description>
						</Timeline.Content>
					</Timeline.Item>

					<Timeline.Item>
						<Timeline.Separator>
							<GitCommit class="h-3 w-3" />
						</Timeline.Separator>
						<Timeline.Content>
							<Timeline.Title>Bug Fixes</Timeline.Title>
							<Timeline.Description>Resolved issues #102, #105.</Timeline.Description>
						</Timeline.Content>
					</Timeline.Item>

					<Timeline.Item>
						<Timeline.Separator class="bg-destructive/40 text-white border-destructive/60">
							<AlertCircle class="h-3 w-3" />
						</Timeline.Separator>
						<Timeline.Content>
							<Timeline.Title>Critical Error</Timeline.Title>
							<Timeline.Description>Database connection lost.</Timeline.Description>
						</Timeline.Content>
					</Timeline.Item>
				</Timeline.Root>
			</DocPage.Preview>
			<DocPage.Code
				code={`<Timeline.Separator class="bg-primary">
  <Rocket />
</Timeline.Separator>`}
			/>
		</DocPage.Example>

		<DocPage.Heading>Git History</DocPage.Heading>
		<DocPage.Text>A compact layout suitable for changelogs or commit history.</DocPage.Text>
		<DocPage.Example>
			<DocPage.Preview class="p-10 flex justify-start">
				<Timeline.Root>
					<Timeline.Item>
						<Timeline.Separator class="bg-primary text-primary-foreground border-primary">
							<div class="h-2 w-2 bg-current rounded-full" />
						</Timeline.Separator>
						<Timeline.Content>
							<div class="flex items-center gap-2">
								<Timeline.Title>v2.4.0</Timeline.Title>
								<span
									class="text-[10px] px-1.5 py-0.5 rounded-full bg-green-500/10 text-green-600 font-medium"
									>Latest</span
								>
							</div>
							<Timeline.Date>2 hours ago</Timeline.Date>
							<div
								class="text-sm text-muted-foreground bg-muted/30 p-2 rounded border mt-1 font-mono text-xs"
							>
								feat: add new timeline component<br />
								fix: alignment issues in popover
							</div>
						</Timeline.Content>
					</Timeline.Item>

					<Timeline.Item>
						<Timeline.Separator>
							<div class="h-2 w-2 bg-muted-foreground rounded-full" />
						</Timeline.Separator>
						<Timeline.Content>
							<Timeline.Title>v2.3.1</Timeline.Title>
							<Timeline.Date>Yesterday</Timeline.Date>
							<Timeline.Description>Hotfix for production authentication bug.</Timeline.Description>
						</Timeline.Content>
					</Timeline.Item>

					<Timeline.Item>
						<Timeline.Separator>
							<div class="h-2 w-2 bg-muted-foreground rounded-full" />
						</Timeline.Separator>
						<Timeline.Content>
							<Timeline.Title>v2.3.0</Timeline.Title>
							<Timeline.Date>2 days ago</Timeline.Date>
							<Timeline.Description>Initial release of the dashboard features.</Timeline.Description
							>
						</Timeline.Content>
					</Timeline.Item>
				</Timeline.Root>
			</DocPage.Preview>
			<DocPage.Code
				code={`<Timeline.Item>
   <Timeline.Separator class="bg-primary">
      <div class="dot" />
   </Timeline.Separator>
   <Timeline.Content>
      <div class="flex items-center gap-2">
         <Timeline.Title>v2.4.0</Timeline.Title>
         <Badge>Latest</Badge>
      </div>
      <div class="code-block">...</div>
   </Timeline.Content>
</Timeline.Item>`}
			/>
		</DocPage.Example>

		<DocPage.Heading>Order Tracking</DocPage.Heading>
		<DocPage.Example>
			<DocPage.Preview class="p-10 flex justify-start">
				<Timeline.Root>
					<Timeline.Item>
						<Timeline.Separator class="bg-blue-500 text-white border-blue-500">
							<Truck class="h-3 w-3" />
						</Timeline.Separator>
						<Timeline.Content>
							<Timeline.Title class="text-blue-600">Out for Delivery</Timeline.Title>
							<Timeline.Date>Today, 9:41 AM</Timeline.Date>
							<Timeline.Description>The driver is nearby.</Timeline.Description>
						</Timeline.Content>
					</Timeline.Item>

					<Timeline.Item>
						<Timeline.Separator class="bg-muted text-foreground">
							<MapPin class="h-3 w-3" />
						</Timeline.Separator>
						<Timeline.Content>
							<Timeline.Title>Arrived at Facility</Timeline.Title>
							<Timeline.Date>Yesterday, 4:00 PM</Timeline.Date>
							<Timeline.Description>Processed at New York Distribution Center.</Timeline.Description
							>
						</Timeline.Content>
					</Timeline.Item>

					<Timeline.Item>
						<Timeline.Separator class="bg-muted text-foreground">
							<Package class="h-3 w-3" />
						</Timeline.Separator>
						<Timeline.Content>
							<Timeline.Title>Order Placed</Timeline.Title>
							<Timeline.Date>Oct 24, 2024</Timeline.Date>
						</Timeline.Content>
					</Timeline.Item>
				</Timeline.Root>
			</DocPage.Preview>
			<DocPage.Code
				code={`<Timeline.Item>
   <Timeline.Separator class="bg-blue-500 text-white">
      <Truck />
   </Timeline.Separator>
   <Timeline.Content>
      <Timeline.Title class="text-blue-600">Out for Delivery</Timeline.Title>
      ...
   </Timeline.Content>
</Timeline.Item>`}
			/>
		</DocPage.Example>

		<DocPage.Heading>Rich Content</DocPage.Heading>
		<DocPage.Example>
			<DocPage.Preview class="p-10 flex justify-start">
				<Timeline.Root>
					<Timeline.Item>
						<Timeline.Separator />
						<Timeline.Content>
							<Timeline.Date>October 12, 2024</Timeline.Date>
							<Timeline.Title>New Design Assets</Timeline.Title>
							<p class="text-sm text-muted-foreground mt-1 mb-2">
								The design team uploaded the final mockups for the landing page.
							</p>
							<div class="grid grid-cols-2 gap-2 max-w-[300px]">
								<div
									class="aspect-video bg-muted rounded-md border flex items-center justify-center text-xs text-muted-foreground"
								>
									Mockup 1
								</div>
								<div
									class="aspect-video bg-muted rounded-md border flex items-center justify-center text-xs text-muted-foreground"
								>
									Mockup 2
								</div>
							</div>
						</Timeline.Content>
					</Timeline.Item>

					<Timeline.Item>
						<Timeline.Separator class="border-amber-500 text-amber-600 bg-amber-600/10">
							<span class="font-bold text-[10px]">!</span>
						</Timeline.Separator>
						<Timeline.Content>
							<Timeline.Date>October 15, 2024</Timeline.Date>
							<div class="p-3 border rounded-md bg-amber-600/10 border-amber-600/30">
								<h4 class="text-sm font-semibold text-amber-800 dark:text-amber-200">
									Review Required
								</h4>
								<p class="text-xs text-amber-700 dark:text-amber-600 mt-1">
									Please approve the assets before Friday.
								</p>
							</div>
						</Timeline.Content>
					</Timeline.Item>
				</Timeline.Root>
			</DocPage.Preview>
			<DocPage.Code
				code={`<Timeline.Item>
  <Timeline.Content>
     <Timeline.Title>New Assets</Timeline.Title>
     <div class="grid grid-cols-2 gap-2">
        <img src="..." />
        <img src="..." />
     </div>
  </Timeline.Content>
</Timeline.Item>`}
			/>
		</DocPage.Example>
	</DocPage.Content>
</DocPage.Root>
