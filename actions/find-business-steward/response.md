{if successResult.found}
The business steward for {successResult.formattedCommunityLink} is {successResult.formattedStewardLink}.
{else}
No steward is set for {successResult.formattedCommunityLink}. You may want to try searching child communities of {successResult.formattedCommunityLink}.
{endif}