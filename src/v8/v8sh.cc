// Parts Copyright 2008 Louis P. Santillan (louis.p.santillan@gmail.com)
// Copyright 2008 the V8 project authors. All rights reserved.
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are
// met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above
//       copyright notice, this list of conditions and the following
//       disclaimer in the documentation and/or other materials provided
//       with the distribution.
//     * Neither the name of Google Inc. nor the names of its
//       contributors may be used to endorse or promote products derived
//       from this software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
// "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
// LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
// A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
// OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
// LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
// DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
// THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
// (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
// OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
// To compile, you must build V8 JavaScript Engine from svn.  See the
//    following link (http://code.google.com/apis/v8/build.html) for an
//    example of how to build the shell.  Executing the following to
//    achieve this:
//    svn checkout http://v8.googlecode.com/svn/trunk/ v8
//    cd v8
//    scons mode=release library=static snapshot=on sample=shell
//    cd ..
//    g++ -O3 -o v8sh v8sh.cc -I./v8/src -L./v8 -lv8 -lpthread

#include <v8.h>
#include <cstring>
#include <cstdio>
#include <cstdlib>
#include <string>
#include <unistd.h>


void RunShell(v8::Handle<v8::Context> context);
bool ExecuteString(v8::Handle<v8::String> source,
                   v8::Handle<v8::Value> name,
                   bool print_result,
                   bool report_exceptions);
v8::Handle<v8::Value> Print(const v8::Arguments& args);
v8::Handle<v8::Value> Load(const v8::Arguments& args);
v8::Handle<v8::Value> Quit(const v8::Arguments& args);
v8::Handle<v8::Value> Version(const v8::Arguments& args);
v8::Handle<v8::Value> Read_Line(const v8::Arguments& args);
v8::Handle<v8::Value> File_Exists(const v8::Arguments& args);
v8::Handle<v8::Value> File_Write(const v8::Arguments& args);
v8::Handle<v8::Value> File_Read(const v8::Arguments& args);
v8::Handle<v8::String> ReadFile(const char* name);
void ReportException(v8::TryCatch* handler);

v8::Handle<v8::Array> arguments;

int main(int argc, char* argv[]) {
  v8::V8::SetFlagsFromCommandLine(&argc, argv, true);
  v8::HandleScope handle_scope;
  // Create a template for the global object.
  v8::Handle<v8::ObjectTemplate> global = v8::ObjectTemplate::New();
  // Bind the global 'print' function to the C++ Print callback.
  global->Set(v8::String::New("print"), v8::FunctionTemplate::New(Print));
  // Bind the global 'load' function to the C++ Load callback.
  global->Set(v8::String::New("load"), v8::FunctionTemplate::New(Load));
  // Bind the 'quit' function
  global->Set(v8::String::New("quit"), v8::FunctionTemplate::New(Quit));
  // Bind the 'version' function
  global->Set(v8::String::New("version"), v8::FunctionTemplate::New(Version));
  // Bind the 'read_line' function
  global->Set(v8::String::New("read_line"), v8::FunctionTemplate::New(Read_Line));
  // Bind the 'file_exists' function
  global->Set(v8::String::New("file_exists"), v8::FunctionTemplate::New(File_Exists));
  // Bind the 'file_write' function
  global->Set(v8::String::New("file_write"), v8::FunctionTemplate::New(File_Write));
  // Bind the 'file_read' function
  global->Set(v8::String::New("file_read"), v8::FunctionTemplate::New(File_Read));
  // Create a new execution environment containing the built-in
  // functions
  v8::Handle<v8::Context> context = v8::Context::New(NULL, global);
  // Enter the newly created execution environment.
  v8::Context::Scope context_scope(context);

  // Bind the 'arguments' array
  arguments = v8::Array::New( argc - 2 );
  for( int i = 2; i < argc; i++ )
  {
     arguments->Set( v8::Number::New( i - 2 ), v8::String::New( argv[ i ] ) );
  }
  context->Global()->Set( v8::String::New( "arguments" ), arguments );

  bool run_shell = (argc == 1);
  int script_count = 0;
  for (int i = 1; i < argc; i++) {
    const char* str = argv[i];
    if (strcmp(str, "--shell") == 0) {
      run_shell = true;
    } else if (strcmp(str, "-f") == 0) {
      // Ignore any -f flags for compatibility with the other stand-
      // alone JavaScript engines.
      continue;
    } else if (strncmp(str, "--", 2) == 0) {
      printf("Warning: unknown flag %s.\n", str);
    } else if (strcmp(str, "-e") == 0 && i + 1 < argc) {
      // Execute argument given to -e option directly
      v8::HandleScope handle_scope;
      v8::Handle<v8::String> file_name = v8::String::New("unnamed");
      v8::Handle<v8::String> source = v8::String::New(argv[i + 1]);
      if (!ExecuteString(source, file_name, false, true))
        return 1;
      i++;
    } else {
      if( run_shell ) continue;
      if( ++script_count <= 1 )
      {
         // Use all other arguments as names of files to load and run.
         v8::HandleScope handle_scope;
         v8::Handle<v8::String> file_name = v8::String::New(str);
         v8::Handle<v8::String> source = ReadFile(str);
         if (source.IsEmpty()) {
           printf("Error reading '%s'\n", str);
           return 1;
         }
         if (!ExecuteString(source, file_name, false, true))
           return 1;
      }
    }
  }
  if (run_shell) RunShell(context);
  return 0;
}


// The callback that is invoked by v8 whenever the JavaScript 'print'
// function is called.  Prints its arguments on stdout separated by
// spaces and ending with a newline.
v8::Handle<v8::Value> Print(const v8::Arguments& args) {
  bool first = true;
  for (int i = 0; i < args.Length(); i++) {
    v8::HandleScope handle_scope;
    if (first) {
      first = false;
    } else {
      printf(" ");
    }
    v8::String::Utf8Value str(args[i]);
    printf("%s", *str);
  }
  printf("\n");
  return v8::Undefined();
}


// The callback that is invoked by v8 whenever the JavaScript 'load'
// function is called.  Loads, compiles and executes its argument
// JavaScript file.
v8::Handle<v8::Value> Load(const v8::Arguments& args) {
  for (int i = 0; i < args.Length(); i++) {
    v8::HandleScope handle_scope;
    v8::String::Utf8Value file(args[i]);
    v8::Handle<v8::String> source = ReadFile(*file);
    if (source.IsEmpty()) {
      return v8::ThrowException(v8::String::New("Error loading file"));
    }
    if (!ExecuteString(source, v8::String::New(*file), false, false)) {
      return v8::ThrowException(v8::String::New("Error executing  file"));
    }
  }
  return v8::Undefined();
}


// The callback that is invoked by v8 whenever the JavaScript 'quit'
// function is called.  Quits.
v8::Handle<v8::Value> Quit(const v8::Arguments& args) {
  // If not arguments are given args[0] will yield undefined which
  // converts to the integer value 0.
  int exit_code = args[0]->Int32Value();
  exit(exit_code);
  return v8::Undefined();
}


v8::Handle<v8::Value> Version(const v8::Arguments& args) {
  return v8::String::New(v8::V8::GetVersion());
}

v8::Handle<v8::Value> Read_Line( const v8::Arguments& args )
{
   char buf[ 256 ];

   buf[ 255 ] = '\0';

   scanf( "%255[^\n]", buf );

   return( v8::String::New( buf ) );
}

v8::Handle<v8::Value> File_Exists( const v8::Arguments& args )
{
   v8::String::Utf8Value f( args[ 0 ] );

   if( access( *f, R_OK | F_OK ) == 0 )
   {
      return( v8::Boolean::New( true ) );
   }

   return( v8::Boolean::New( false ) );
}

v8::Handle<v8::Value> File_Write( const v8::Arguments& args )
{
   v8::String::Utf8Value f( args[ 0 ] ), d( args[ 1 ] );

   FILE* fp = fopen( *f, "w" );

   if( fp == NULL )
   {
      return( v8::Boolean::New( false ) );
   }

   fputs( *d, fp );

   fclose( fp );

   return( v8::Boolean::New( true ) );
}

v8::Handle<v8::Value> File_Read( const v8::Arguments& args )
{
   v8::String::Utf8Value f( args[ 0 ] );

   return( ReadFile( *f ) );
}

// Reads a file into a v8 string.
v8::Handle<v8::String> ReadFile(const char* name) {
  FILE* file = fopen(name, "rb");
  if (file == NULL) return v8::Handle<v8::String>();

  fseek(file, 0, SEEK_END);
  int size = ftell(file);
  rewind(file);

  char* chars = new char[size + 1];
  chars[size] = '\0';
  for (int i = 0; i < size;) {
    int read = fread(&chars[i], 1, size - i, file);
    i += read;
  }
  fclose(file);
  v8::Handle<v8::String> result = v8::String::New(chars, size);
  delete[] chars;
  return result;
}


// The read-eval-execute loop of the shell.
void RunShell(v8::Handle<v8::Context> context) {
  printf("V8 version %s\n", v8::V8::GetVersion());
  static const int kBufferSize = 256;
  while (true) {
    char buffer[kBufferSize];
    printf("> ");
    char* str = fgets(buffer, kBufferSize, stdin);
    if (str == NULL) break;
    v8::HandleScope handle_scope;
    ExecuteString(v8::String::New(str),
                  v8::String::New("(shell)"),
                  true,
                  true);
  }
  printf("\n");
}


// Executes a string within the current v8 context.
bool ExecuteString(v8::Handle<v8::String> source,
                   v8::Handle<v8::Value> name,
                   bool print_result,
                   bool report_exceptions) {
  v8::HandleScope handle_scope;
  v8::TryCatch try_catch;
  v8::Handle<v8::Script> script = v8::Script::Compile(source, name);
  if (script.IsEmpty()) {
    // Print errors that happened during compilation.
    if (report_exceptions)
      ReportException(&try_catch);
    return false;
  } else {
    v8::Handle<v8::Value> result = script->Run();
    if (result.IsEmpty()) {
      // Print errors that happened during execution.
      if (report_exceptions)
        ReportException(&try_catch);
      return false;
    } else {
      if (print_result && !result->IsUndefined()) {
        // If all went well and the result wasn't undefined then print
        // the returned value.
        v8::String::Utf8Value str(result);
        printf("%s\n", *str);
      }
      return true;
    }
  }
}


void ReportException(v8::TryCatch* try_catch) {
  v8::HandleScope handle_scope;
  v8::String::Utf8Value exception(try_catch->Exception());
  v8::Handle<v8::Message> message = try_catch->Message();
  if (message.IsEmpty()) {
    // V8 didn't provide any extra information about this error; just
    // print the exception.
    printf("%s\n", *exception);
  } else {
    // Print (filename):(line number): (message).
    v8::String::Utf8Value filename(message->GetScriptResourceName());
    int linenum = message->GetLineNumber();
    printf("%s:%i: %s\n", *filename, linenum, *exception);
    // Print line of source code.
    v8::String::Utf8Value sourceline(message->GetSourceLine());
    printf("%s\n", *sourceline);
    // Print wavy underline (GetUnderline is deprecated).
    int start = message->GetStartColumn();
    for (int i = 0; i < start; i++) {
      printf(" ");
    }
    int end = message->GetEndColumn();
    for (int i = start; i < end; i++) {
      printf("^");
    }
    printf("\n");
  }
}
