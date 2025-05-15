V1.0.0
[x] BUG: Text can be dragged further than the scree
[x] PERFORMANCE: Rewrite HTML imperative version to Canvas declarative
[x] FEATURE: Varying sizes of cells
[x] xSize
[x] FEATURE: Show specific systemuser tasks
[x] FEATURE: Goto next activity
[x] FEATURE: Timeless Timelines items
[x] FEATURE: Smallest unit changed to hours
[x] FEATURE: Process support (status change dates etc.)
[x] Entity input
[x] PERFORMANCE: Fix filter dialog lag.
[x] AVAILABILITY: Translate schemanames for activitytypes
[x] BUG: Crash on lookup focus
[x] FEATURE: Open Activities in custom modal instead of standard
[x] BUG: Infinite Activity Loading
[x] AVAILABILITY: hour translation
[x] BUG: Total in filter no longer correct
[x] BEAUTIFY/REFACTOR: - Lookup - Searchbox - Chip
[x] BUG: Resize does not rerender canvas
[x] BUG: Tab swap does not rerender canvas

V1.1.0
[x] FEATURE: Ability to show user locale timezones instead of UTC
[x] FEATURE: Changeable background
[x] BUG: Year line flickering (disappears) [was only in debugger]
[x] REFACTOR: Change icons to use Lucide
[x] FEATURE: Tooltips on actions
[x] BUG: Must find a way to reduce PCF size (most likely lucide issue with dynamic icons)
[x] AVAILABILITY: Update translations with new tooltips
[x] FEATURE: Icon upload for custom tables (lucide icons)
[x] BEAUTIFY/REFACTOR: - Action Buttons

v2.0.0
[x] UX: Complete refactor over to Fluent UI 9
[x] TODO: Datepicker localization
[x] TODO: Datepicker start/end date sanitization
[x] BUG: Allocated width issues
[x] FEATURE: Edit options
  [x] frame
  [x] dropdown
[x] FEATURE: Priority visualization
[x] FEATURE: Date & Time picker for edit forms
[x] BUG: Remove autocompletes from lookup
[x] FEATURE: open frame from other versions.
[x] FEATURE: state/status visibility
[x] FEATURE: goto date quickaction in toolbar

v2.0.1
[x] BUG: Icon on timepicker not set (results in unknown unicode character)
[x] BUG: Fix the console error about state leak
[x] BUG: Timepicker missing styling
[x] BUG: Fix the invalid date format error in console
[x] UX: Min width of the section (if no items present).
[ ] FEATURE: Fullscreen button

Future
- BUG: Timeline becoming invisible sometimes
- FEATURE: Assign an activity
- Performance: Recude fluentproviders and fix mounting issues of fixed portaled elements
- BUG: Opening a dropdown moves entire timelines somestimes
- FEATURE: warnings/errors for unsupported configuration (toasts)
- FEATURE: onClose of InlineFrameWindow update the selected item
[-] FEATURE: Edit options
  - dialog 
  - drawer
  [-] FEATURE: Varying sizes of cells - ySize / fontSize
- FEATURE: Count on Activity type chips inside filter
- FEATURE: Grey out finished activities
- FEATURE: New Activity button
- FEATURE: Attendies and activityparties, to apply to filter
  [-] FEATURE: Process support (status change dates etc.) - BPF Support
- AVAILABILITY: Translation of custom schemanames
- BUG: Support multiple timelines on one form
- FEATURE: Spinner på refresh
- BUG: Left Stick is odd-looking when all the way left on the timeline
- FEATURE: Increase modal height size
- FEATURE: Darkmode
- FEATURE: Colorblind mode
- FEATURE: Progress/spinner on fetch calls
- TODO: Datepicker timezone control
[!] Write about Attachment size limitations
- AVAILABILIOTY: aria-labels on EVERYTHING