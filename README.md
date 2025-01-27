<div align="center">
    <img style="width: 148px;" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSsRvpWXsSxfzEMwDkS5pWxn-mvL3S2PMxv0A&s"/>
    <img style="width: 148px;" src="https://avatars.githubusercontent.com/u/7015300?s=280&v=4"/>
    <br/>
    <h1 style="font-size: 248px;">Horizontal Timeline</h1>
    <a href="https://www.buymeacoffee.com/VishwaGauravIn" target="_blank"><img alt="" src="https://skillicons.dev/icons?i=ts,html,css,react,tailwind" style="vertical-align:center" /></a>
</div>
<br/>

# 👋 Introductions
The Horizontal Timeline is a generic custom control built on the Power Apps component framework (PCF). 
It is built as an alternative to the classic Vertical Timeline by Microsoft, that I've found very confusing to navigate.

Hopefully you'll find it useful.

# ⚙️ Features & Releases
### Version 1.0.0
<b>Localization - The custom control support below languages in its initial version</b><br/>
<img src="https://raw.githubusercontent.com/stevenrskelton/flag-icon/master/png/16/country-4x3/us.png" /> en-US <b>[default]</b><br/>
<img src="https://raw.githubusercontent.com/stevenrskelton/flag-icon/master/png/16/country-4x3/dk.png" /> da-DK<br/>
<img src="https://raw.githubusercontent.com/stevenrskelton/flag-icon/master/png/16/country-4x3/fr.png" /> fr-FR<br/>
<img src="https://raw.githubusercontent.com/stevenrskelton/flag-icon/master/png/16/country-4x3/es.png" /> es-ES<br/>
<img src="https://raw.githubusercontent.com/stevenrskelton/flag-icon/master/png/16/country-4x3/de.png" /> de-DE<br/>
<img src="https://raw.githubusercontent.com/stevenrskelton/flag-icon/master/png/16/country-4x3/cn.png" /> zh-CN<br/>
<img src="https://raw.githubusercontent.com/stevenrskelton/flag-icon/master/png/16/country-4x3/jp.png" /> ja-JP<br/>
<img src="https://raw.githubusercontent.com/stevenrskelton/flag-icon/master/png/16/country-4x3/sa.png" /> ar-SA<br/>
<img src="https://raw.githubusercontent.com/stevenrskelton/flag-icon/master/png/16/country-4x3/br.png" /> pt-BR<br/>
<img src="https://raw.githubusercontent.com/stevenrskelton/flag-icon/master/png/16/country-4x3/it.png" /> it-IT<br/>
<img src="https://raw.githubusercontent.com/stevenrskelton/flag-icon/master/png/16/country-4x3/in.png" /> hi-IN<br/>
<img src="https://raw.githubusercontent.com/stevenrskelton/flag-icon/master/png/16/country-4x3/nl.png" /> nl-NL<br/>
<img src="https://raw.githubusercontent.com/stevenrskelton/flag-icon/master/png/16/country-4x3/se.png" /> se-SE<br/>
<img src="https://raw.githubusercontent.com/stevenrskelton/flag-icon/master/png/16/country-4x3/fi.png" /> fi-FI<br/>

---

<b>Time units - The custom control supports following time units</b><br/>
The control uses the <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat">Intl.DateTimeFormat</a> object to enable language-sensitive date and time formatting. The control allows for the following formats:

Years 
- full <b>[default]</b> (example = "2025")
- short (example = "25")

Quarters 
- prefix <b>[default = empty]</b> (example = "Quarter " -> "Quarter 1")

Months 
- numeric (example = "1")
- 2-digit (example = "01")
- long <b>[default]</b> (example = "January")
- short (example = "Jan")
- narrow (example = "J")

Weeks
- prefix <b>[default = empty]</b> (example = "W" -> "W1")

Days 
- numeric (example = "1")
- 2-digit <b>[default]</b> (example = "01")
- long (example = "Monday")
- short (example = "Mon")
- narrow (example = "M")

Hours
- numeric (example = "1")
- 2-digit <b>[default]</b> (example = "01")

Hour Cycle
- h11 (example = "01PM")
- h12 (example = "01PM")
- h23 <b>[default]</b> (example = "13")
- h24 (example = "13")

---

<b>Custom table support</b><br/>
When configuring the control you can give a json-formatted string that will describe supported tables.
```
{
   "<tablename>": {
     color: "<hex-color>"
   }
}
```
<b>Default</b>
```
{
  "task": {
    "color": "#eab308"
  },
  "appointment": {
    "color": "#7e22ce"
  },
  "milestone": {
    "color": "#e11d48"
  },
  "email": {
    "color": "#16a34a"
  },
  "phonecall": {
    "color": "#fb7185"
  }
}
```

---

<b>Custom milestones</b><br/>
Milestones are dates on your record, that you wish to see on the timeline. You can define a json-formatted string that will describe the dates put into the timeline. Note that if the column schemaname is incorrect, the milestone is not shown - without any errors/warnings.
```
{
  "<column-schemaname>": "<display name>"
}
```
<b>Default</b>
```
{
  "createdon": "Created On",
  "estimatedclosedate": "Estimated Close",
  "actualclose": "Actual Close"
}
```

---

<b>Custom scaling</b><br/>
You can adjust the smallest unit's size (an hour) on the timeline. All other date elements will follow this sizing.
Example: if set to 1 (minimum size) -> a day will become 24px in width -> a week will become 24px*7=188px in width.
<b>default = 4</b>

---

<b>Filter</b></br>
Inside the filter you have the following options:
- Filter by display name (text search)
- Filter by activitytype (chip toggles)
- Filter by date-interval (date picker)
- Filter by owner (lookup)

---

<b>Timeless items</b></br>
You can also see items that do not have any due date (scheduledend) as this is the case. These items will show in a side pane.

---

<b>Smaller features</b></br>
- Touch support
- Canvas & Custom Page support

# 🏆 Credits:
Lucki2g / Software Ape - Developer

# 📋 Road-map:
[x] BUG: Text can be dragged further than the screen
[x] PERFORMANCE: Rewrite HTML imperative obygning til Canvas og declarative 
[-] FEATURE: Varying sizes of cells
    [x] xSize
    - ySize / fontSize
[x] FEATURE: Show specific systemuser tasks
[x] FEATURE: Goto next activity
- FEATURE: Count on Activity type chips inside filter
[x] FEATURE: Timeless Timelines items
- FEATURE: Fullscreen
- FEATURE: Tooltips on actions
[x] FEATURE: Smallest unit changed to hours
- FEATURE: Priority visualization
- FEATURE: Grey out finished activities
- FEATURE: New Activity button
[-] FEATURE: Process support (status change dates etc.)
    [x] Entity input
    - BPF Support
[-] PERFORMANCE: Fix filter dialog lag.
- FEATURE: Attendies and activityparties, to apply to filter
[x] AVAILABILITY: Translate schemanames for activitytypes
AVAILABILITY: Translation of custom schemanames
[x] BUG: Crash on lookup focus
- BUG: Support multiple timelines on one form
- FEATURE: Open Activities in custom modal instead of standard
[x] BUG: Infinite Activity Loading
- FEATURE: Spinner på refresh
[x] AVAILABILITY: hour translation
[x] BUG: Total in filter no longer correct
- FEATURE: Icon upload for custom tables
[x] BEAUTIFY/REFACTOR:
    - Lookup
    - Searchbox
    - Chip
[x] BUG: Resize does not rerender canvas
[x] BUG: Tab swap does not rerender canvas
- FEATURE: Ability to show user locale timezones instead of UTC
