import { promises as fs } from "node:fs";
import path from "node:path";

// ---------------------------------------------------------------------------
// build.zig template
// ---------------------------------------------------------------------------

const BUILD_ZIG_CONTENT = `const std = @import("std");

pub fn build(b: *std.Build) void {
    const target = b.standardTargetOptions(.{});
    const optimize = b.standardOptimizeOption(.{});

    const lib = b.addStaticLibrary(.{
        .name = "exercise",
        .root_source_file = b.path("src/root.zig"),
        .target = target,
        .optimize = optimize,
    });

    const test_step = b.step("test", "Run all exercise tests");

    var tests_dir = std.fs.cwd().openDir("tests", .{ .iterate = true }) catch return;
    defer tests_dir.close();

    var iter = tests_dir.iterate();
    while (iter.next() catch null) |entry| {
        if (entry.kind != .file) continue;
        if (!std.mem.endsWith(u8, entry.name, ".zig")) continue;

        const test_path = b.fmt("tests/{s}", .{entry.name});
        const unit_tests = b.addTest(.{
            .root_source_file = b.path(test_path),
            .target = target,
            .optimize = optimize,
        });
        unit_tests.root_module.addImport("exercise", &lib.root_module);

        const run_tests = b.addRunArtifact(unit_tests);
        test_step.dependOn(&run_tests.step);
    }
}
`;

// ---------------------------------------------------------------------------
// src/root.zig stub
// ---------------------------------------------------------------------------

const ROOT_ZIG_CONTENT = `// src/root.zig — exercise module entry point
// The starter-expand stage will fill in the exercise functions here.
// Additional source files in src/ can be imported and re-exported below.
`;

// ---------------------------------------------------------------------------
// Writer
// ---------------------------------------------------------------------------

export async function writeZigProjectConfig(dir) {
  const srcDir = path.join(dir, "src");
  const testsDir = path.join(dir, "tests");
  await fs.mkdir(srcDir, { recursive: true });
  await fs.mkdir(testsDir, { recursive: true });
  await fs.writeFile(path.join(dir, "build.zig"), BUILD_ZIG_CONTENT);
  await fs.writeFile(path.join(srcDir, "root.zig"), ROOT_ZIG_CONTENT);
}
