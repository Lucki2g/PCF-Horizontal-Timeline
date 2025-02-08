# solution preparation
pac solution init --publisher-name delegate --publisher-prefix dg

<ItemGroup>
    <ProjectReference Include="..\timeline.pcfproj" />
</ItemGroup>

# build
msbuild /t:build /restore
msbuild /t:build /restore /p:Configuration=Release