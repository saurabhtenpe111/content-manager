import React, { useState } from 'react';
import { CMSLayout } from '@/components/layout/CMSLayout';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CalendarField } from '@/components/fields/Calendar';
import { InputGroup } from '@/components/fields/InputGroup';
import { InputMask } from '@/components/fields/InputMask';
import { InputSwitch } from '@/components/fields/InputSwitch';
import { TriStateCheckbox } from '@/components/fields/TriStateCheckbox';
import { InputOTP } from '@/components/ui/input-otp';
import { InputOTPGroup } from '@/components/ui/input-otp';
import { InputOTPSlot } from '@/components/ui/input-otp';
import { InputOTPSeparator } from '@/components/ui/input-otp';
import { TreeSelect } from '@/components/fields/TreeSelect';
import { MentionBox } from '@/components/fields/MentionBox';
import { SelectButton } from '@/components/fields/SelectButton';
import { RatingField } from '@/components/fields/RatingField';
import { MultiStateCheckbox } from '@/components/fields/MultiStateCheckbox';
import { Search, Calendar, Mail, User, Plus, Minus, CreditCard } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/utils/cn';

const FieldsDemo = () => {
  // Calendar state
  const [date, setDate] = useState<Date | null>(new Date());
  const [dateRange, setDateRange] = useState<Date[] | null>(null);
  
  // Input Group state
  const [inputGroupValue, setInputGroupValue] = useState('');
  
  // Input Mask state
  const [phone, setPhone] = useState('');
  
  // Input Switch state
  const [switchChecked, setSwitchChecked] = useState(false);
  
  // Tri State Checkbox state
  const [triState, setTriState] = useState<boolean | null>(null);
  
  // OTP state
  const [otp, setOtp] = useState('');
  
  // Tree Select state
  const [selectedNode, setSelectedNode] = useState<string>('');
  const [multiSelectedNodes, setMultiSelectedNodes] = useState<string[]>([]);
  
  // Mention state
  const [mentionText, setMentionText] = useState('');
  
  // Select Button state
  const [selectedButton, setSelectedButton] = useState('');
  
  // Rating state
  const [rating, setRating] = useState(0);
  
  // Multi State Checkbox state
  const [multiState, setMultiState] = useState('');
  
  const treeData = [
    {
      id: '1',
      label: 'Documents',
      value: 'documents',
      children: [
        {
          id: '1-1',
          label: 'Work',
          value: 'work',
          children: [
            { id: '1-1-1', label: 'Reports', value: 'reports' },
            { id: '1-1-2', label: 'Presentations', value: 'presentations' }
          ]
        },
        {
          id: '1-2',
          label: 'Personal',
          value: 'personal',
          children: [
            { id: '1-2-1', label: 'Photos', value: 'photos' },
            { id: '1-2-2', label: 'Videos', value: 'videos' }
          ]
        }
      ]
    },
    {
      id: '2',
      label: 'Downloads',
      value: 'downloads',
      children: [
        { id: '2-1', label: 'Music', value: 'music' },
        { id: '2-2', label: 'Movies', value: 'movies' }
      ]
    }
  ];
  
  const mentionSuggestions = [
    { id: '1', display: 'John' },
    { id: '2', display: 'Jane' },
    { id: '3', display: 'Alice' },
    { id: '4', display: 'Bob' },
    { id: '5', display: 'Charlie' }
  ];
  
  const selectButtonOptions = [
    { label: 'Small', value: 'sm' },
    { label: 'Medium', value: 'md' },
    { label: 'Large', value: 'lg' },
    { label: 'XL', value: 'xl', disabled: true }
  ];
  
  const multiStateOptions = ['Yes', 'No', 'Maybe'];
  
  const handleCalendarChange = (value: Date | Date[] | null) => {
    if (Array.isArray(value)) {
      setDateRange(value);
      toast.success(`Selected date range: ${value.map(d => d.toLocaleDateString()).join(' to ')}`);
    } else {
      setDate(value);
      toast.success(`Selected date: ${value?.toLocaleDateString()}`);
    }
  };

  const validateOtp = (value: string) => {
    if (value.length < 6) {
      toast.error('OTP must be 6 digits');
      return false;
    }
    
    toast.success('OTP verified!');
    return true;
  };

  const handleSubmitOtp = () => {
    if (validateOtp(otp)) {
      // Proceed with verification
      console.log('OTP submitted:', otp);
    }
  };

  const handleResetOtp = () => {
    setOtp('');
    toast('OTP reset');
  };
  
  return (
    <CMSLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Form Fields Demo</h1>
          <p className="text-muted-foreground mt-1">
            Explore various form field components and their configurations
          </p>
        </div>
        
        <Tabs defaultValue="calendar">
          <TabsList className="w-full overflow-x-auto flex flex-nowrap">
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
            <TabsTrigger value="inputGroup">Input Group</TabsTrigger>
            <TabsTrigger value="inputMask">Input Mask</TabsTrigger>
            <TabsTrigger value="inputSwitch">Input Switch</TabsTrigger>
            <TabsTrigger value="triState">Tri-State Checkbox</TabsTrigger>
            <TabsTrigger value="otp">OTP Input</TabsTrigger>
            <TabsTrigger value="treeSelect">Tree Select</TabsTrigger>
            <TabsTrigger value="mention">Mention Box</TabsTrigger>
            <TabsTrigger value="selectButton">Select Button</TabsTrigger>
            <TabsTrigger value="rating">Rating</TabsTrigger>
            <TabsTrigger value="multiState">Multi-State Checkbox</TabsTrigger>
          </TabsList>
          
          <TabsContent value="calendar" className="space-y-6 pt-4">
            <h2 className="text-xl font-semibold">Calendar Component</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Calendar</CardTitle>
                  <CardDescription>Simple date picker without extra configuration</CardDescription>
                </CardHeader>
                <CardContent>
                  <CalendarField 
                    label="Select Date"
                    value={date || undefined}
                    onChange={handleCalendarChange}
                    description="Click to open the calendar"
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Date Format & Icon</CardTitle>
                  <CardDescription>Custom date format with calendar icon</CardDescription>
                </CardHeader>
                <CardContent>
                  <CalendarField 
                    label="Date with Format"
                    value={date || undefined}
                    onChange={handleCalendarChange}
                    dateFormat="MM/dd/yyyy"
                    showIcon={true}
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Date Range Selection</CardTitle>
                  <CardDescription>Select a range of dates</CardDescription>
                </CardHeader>
                <CardContent>
                  <CalendarField 
                    label="Date Range"
                    value={dateRange || undefined}
                    onChange={handleCalendarChange}
                    range={true}
                    showButtons={true}
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Multiple Months & Time</CardTitle>
                  <CardDescription>Display multiple months with time selection</CardDescription>
                </CardHeader>
                <CardContent>
                  <CalendarField 
                    label="Date and Time"
                    value={date || undefined}
                    onChange={handleCalendarChange}
                    multipleMonths={2}
                    showTime={true}
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Month Picker</CardTitle>
                  <CardDescription>Select only a month</CardDescription>
                </CardHeader>
                <CardContent>
                  <CalendarField 
                    label="Month Only"
                    value={date || undefined}
                    onChange={handleCalendarChange}
                    monthsOnly={true}
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Min & Max Date</CardTitle>
                  <CardDescription>Restrict date selection within a range</CardDescription>
                </CardHeader>
                <CardContent>
                  <CalendarField 
                    label="Restricted Dates"
                    value={date || undefined}
                    onChange={handleCalendarChange}
                    minDate={new Date(2023, 0, 1)}
                    maxDate={new Date(2025, 11, 31)}
                    invalid={false}
                    floatingLabel={true}
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Inline Calendar</CardTitle>
                  <CardDescription>Always visible calendar without popup</CardDescription>
                </CardHeader>
                <CardContent>
                  <CalendarField 
                    label="Inline Mode"
                    value={date || undefined}
                    onChange={handleCalendarChange}
                    inline={true}
                    showButtons={true}
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Invalid & Disabled States</CardTitle>
                  <CardDescription>Error and disabled calendar examples</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <CalendarField 
                    label="Invalid Calendar"
                    value={date || undefined}
                    onChange={handleCalendarChange}
                    invalid={true}
                    error="Please select a valid date"
                  />
                  <Separator />
                  <CalendarField 
                    label="Disabled Calendar"
                    value={date || undefined}
                    disabled={true}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="inputGroup" className="space-y-6 pt-4">
            <h2 className="text-xl font-semibold">Input Group Component</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Input Group</CardTitle>
                  <CardDescription>Input with prefix and suffix elements</CardDescription>
                </CardHeader>
                <CardContent>
                  <InputGroup 
                    label="Search"
                    prefix={<Search size={16} />}
                    suffix=".com"
                    value={inputGroupValue}
                    onChange={setInputGroupValue}
                    placeholder="Enter search term"
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Multiple Addons</CardTitle>
                  <CardDescription>Multiple elements on both sides</CardDescription>
                </CardHeader>
                <CardContent>
                  <InputGroup 
                    label="Email Address"
                    prefixMultiple={[<Mail size={16} />, <User size={16} />]}
                    suffixMultiple={['@', 'example.com']}
                    value={inputGroupValue}
                    onChange={setInputGroupValue}
                    placeholder="username"
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Button Addons</CardTitle>
                  <CardDescription>Input with button addons</CardDescription>
                </CardHeader>
                <CardContent>
                  <InputGroup 
                    label="Quantity"
                    prefixButton={<Minus size={16} />}
                    suffixButton={<Plus size={16} />}
                    value={inputGroupValue}
                    onChange={setInputGroupValue}
                    placeholder="0"
                    type="number"
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Checkbox & Radio</CardTitle>
                  <CardDescription>Input with checkbox and radio addons</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <InputGroup 
                    label="Subscribe"
                    prefixCheckbox={true}
                    value={inputGroupValue}
                    onChange={setInputGroupValue}
                    placeholder="Enter email address"
                    onCheckboxChange={(checked) => toast(checked ? 'Subscribed' : 'Unsubscribed')}
                  />
                  
                  <InputGroup 
                    label="Payment Method"
                    prefixRadio={true}
                    radioOptions={[
                      { label: 'Credit', value: 'credit' },
                      { label: 'Debit', value: 'debit' }
                    ]}
                    suffix={<CreditCard size={16} />}
                    value={inputGroupValue}
                    onChange={setInputGroupValue}
                    onRadioChange={(value) => toast(`Selected: ${value}`)}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="inputMask" className="space-y-6 pt-4">
            <h2 className="text-xl font-semibold">Input Mask Component</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Input Mask</CardTitle>
                  <CardDescription>Simple phone number mask</CardDescription>
                </CardHeader>
                <CardContent>
                  <InputMask 
                    label="Phone Number"
                    mask="(999) 999-9999"
                    value={phone}
                    onChange={setPhone}
                    placeholder="Enter phone number"
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Custom Masks</CardTitle>
                  <CardDescription>Date and credit card masks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <InputMask 
                    label="Date"
                    mask="99/99/9999"
                    placeholder="MM/DD/YYYY"
                  />
                  
                  <InputMask 
                    label="Credit Card"
                    mask="9999-9999-9999-9999"
                    placeholder="XXXX-XXXX-XXXX-XXXX"
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Optional Mask</CardTitle>
                  <CardDescription>Optional character masking</CardDescription>
                </CardHeader>
                <CardContent>
                  <InputMask 
                    label="Phone with Extension"
                    mask="(999) 999-9999 ext 9999"
                    optional={true}
                    placeholder="(555) 555-5555 ext 1234"
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Input Mask Variants</CardTitle>
                  <CardDescription>Floating label and filled variants</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <InputMask 
                    label="Zip Code"
                    mask="99999-9999"
                    floatingLabel={true}
                  />
                  
                  <InputMask 
                    label="Social Security"
                    mask="999-99-9999"
                    filled={true}
                    slotChar="#"
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Invalid & Disabled</CardTitle>
                  <CardDescription>Error and disabled mask inputs</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <InputMask 
                    label="Invalid Input"
                    mask="aaa-9999"
                    invalid={true}
                    error="Please enter a valid code"
                  />
                  
                  <InputMask 
                    label="Disabled Input"
                    mask="(999) 999-9999"
                    disabled={true}
                    value="(555) 123-4567"
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="inputSwitch" className="space-y-6 pt-4">
            <h2 className="text-xl font-semibold">Input Switch Component</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Switch</CardTitle>
                  <CardDescription>Default switch implementation</CardDescription>
                </CardHeader>
                <CardContent>
                  <InputSwitch 
                    label="Enable notifications"
                    checked={switchChecked}
                    onChange={setSwitchChecked}
                    description="Receive notifications when someone mentions you"
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Preselected Switch</CardTitle>
                  <CardDescription>Switch with initial checked state</CardDescription>
                </CardHeader>
                <CardContent>
                  <InputSwitch 
                    label="Dark mode"
                    checked={true}
                    onChange={(value) => toast(value ? 'Dark mode enabled' : 'Dark mode disabled')}
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Invalid Switch</CardTitle>
                  <CardDescription>Switch with error state</CardDescription>
                </CardHeader>
                <CardContent>
                  <InputSwitch 
                    label="Terms and conditions"
                    checked={false}
                    onChange={(value) => toast(value ? 'Accepted' : 'Not accepted')}
                    invalid={true}
                    error="You must accept the terms and conditions"
                    required={true}
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Disabled Switch</CardTitle>
                  <CardDescription>Non-interactive switch example</CardDescription>
                </CardHeader>
                <CardContent>
                  <InputSwitch 
                    label="Premium features"
                    checked={true}
                    disabled={true}
                    description="Upgrade your account to enable this feature"
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="triState" className="space-y-6 pt-4">
            <h2 className="text-xl font-semibold">Tri-State Checkbox Component</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Tri-State Checkbox</CardTitle>
                  <CardDescription>Cycle through three states: checked, unchecked, indeterminate</CardDescription>
                </CardHeader>
                <CardContent>
                  <TriStateCheckbox 
                    label="Select all items"
                    value={triState}
                    onChange={setTriState}
                    description="Click to cycle through states: yes, no, partially"
                  />
                  <div className="mt-2">
                    Current state: {triState === null ? 'indeterminate' : triState ? 'checked' : 'unchecked'}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Filled Style</CardTitle>
                  <CardDescription>Tri-state checkbox with filled background</CardDescription>
                </CardHeader>
                <CardContent>
                  <TriStateCheckbox 
                    label="Remember preferences"
                    value={true}
                    filled={true}
                    onChange={(value) => toast(`New state: ${value === null ? 'indeterminate' : value ? 'checked' : 'unchecked'}`)}
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Invalid State</CardTitle>
                  <CardDescription>Error state for invalid selection</CardDescription>
                </CardHeader>
                <CardContent>
                  <TriStateCheckbox 
                    label="Accept terms"
                    value={false}
                    onChange={(value) => toast(`Selection: ${value}`)}
                    invalid={true}
                    error="You must accept the terms"
                    required={true}
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Disabled State</CardTitle>
                  <CardDescription>Non-interactive tri-state checkbox</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <TriStateCheckbox 
                    label="Admin privileges"
                    value={null}
                    disabled={true}
                    description="Contact administrator to change this setting"
                  />
                  
                  <TriStateCheckbox 
                    label="Global settings"
                    value={true}
                    disabled={true}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="otp" className="space-y-6 pt-4">
            <h2 className="text-xl font-semibold">OTP Input Component</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic OTP Input</CardTitle>
                  <CardDescription>Simple 6-digit verification code input</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Verification Code</label>
                    <InputOTP
                      value={otp}
                      onChange={setOtp}
                      maxLength={6}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSeparator />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                    <p className="text-xs text-muted-foreground">
                      Enter the 6-digit code sent to your phone
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Masked OTP</CardTitle>
                  <CardDescription>Security-focused OTP input with masking</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Secure Code</label>
                    <InputOTP
                      value={otp}
                      onChange={setOtp}
                      maxLength={6}
                      render={({ slots }) => (
                        <InputOTPGroup>
                          {slots.map((slot, index) => (
                            <InputOTPSlot
                              key={index}
                              {...slot}
                              mask
                              index={index}
                            />
                          ))}
                        </InputOTPGroup>
                      )}
                    />
                    <p className="text-xs text-muted-foreground">
                      Hidden for security purposes
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Functional OTP Sample</CardTitle>
                  <CardDescription>Complete OTP verification flow with validation</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Authentication Code</label>
                      <InputOTP
                        value={otp}
                        onChange={setOtp}
                        maxLength={6}
                      >
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSeparator />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                      {otp.length > 0 && otp.length < 6 && (
                        <p className="text-xs text-destructive">
                          Please enter all 6 digits
                        </p>
                      )}
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={handleSubmitOtp}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm"
                        disabled={otp.length !== 6}
                      >
                        Verify
                      </button>
                      <button
                        onClick={handleResetOtp}
                        className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md text-sm"
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Integer Only OTP</CardTitle>
                  <CardDescription>Restrict input to numbers only</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">PIN Code</label>
                    <InputOTP
                      value={otp}
                      onChange={setOtp}
                      maxLength={4}
                      pattern="^[0-9]+$"
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                      </InputOTPGroup>
                    </InputOTP>
                    <p className="text-xs text-muted-foreground">
                      Numbers only (0-9)
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="treeSelect" className="space-y-6 pt-4">
            <h2 className="text-xl font-semibold">Tree Select Component</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Tree Select</CardTitle>
                  <CardDescription>Hierarchical options dropdown</CardDescription>
                </CardHeader>
                <CardContent>
                  <TreeSelect 
                    label="File Location"
                    value={selectedNode}
                    onChange={(value) => {
                      setSelectedNode(value as string);
                      toast(`Selected: ${value}`);
                    }}
                    treeData={treeData}
                    placeholder="Select a location"
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Multiple Selection</CardTitle>
                  <CardDescription>Select multiple nodes with checkboxes</CardDescription>
                </CardHeader>
                <CardContent>
                  <TreeSelect 
                    label="Multiple Files"
                    value={multiSelectedNodes}
                    onChange={(value) => {
                      setMultiSelectedNodes(value as string[]);
                      toast(`Selected ${(value as string[]).length} items`);
                    }}
                    treeData={treeData}
                    multiple={true}
                    checkboxSelection={true}
                    filterable={true}
                    showClear={true}
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Floating Label Style</CardTitle>
                  <CardDescription>Tree select with floating label</CardDescription>
                </CardHeader>
                <CardContent>
                  <TreeSelect 
                    label="Category"
                    value={selectedNode}
                    onChange={(value) => setSelectedNode(value as string)}
                    treeData={treeData}
                    floatingLabel={true}
                    filled={true}
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Invalid & Disabled</CardTitle>
                  <CardDescription>Error and disabled tree select</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <TreeSelect 
                    label="Required Selection"
                    value={selectedNode}
                    onChange={(value) => setSelectedNode(value as string)}
                    treeData={treeData}
                    invalid={true}
                    error="Please select a location"
                    required={true}
                  />
                  
                  <TreeSelect 
                    label="Unavailable Options"
                    value={selectedNode}
                    treeData={treeData}
                    disabled={true}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="mention" className="space-y-6 pt-4">
            <h2 className="text-xl font-semibold">Mention Box Component</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Mention</CardTitle>
                  <CardDescription>Text area with @ mentions</CardDescription>
                </CardHeader>
                <CardContent>
                  <MentionBox 
                    label="Comment"
                    value={mentionText}
                    onChange={setMentionText}
                    suggestions={mentionSuggestions}
                    placeholder="Type @ to mention someone"
                    description="Try typing '@' to mention someone"
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Multiple Triggers</CardTitle>
                  <CardDescription>Support for different trigger characters</CardDescription>
                </CardHeader>
                <CardContent>
                  <MentionBox 
                    label="Message"
                    triggers={['@', '#', '/']}
                    suggestions={mentionSuggestions}
                    placeholder="Type @user, #tag or /command"
                    description="Support for @mentions, #tags and /commands"
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Auto-resize</CardTitle>
                  <CardDescription>Mention box that grows with content</CardDescription>
                </CardHeader>
                <CardContent>
                  <MentionBox 
                    label="Description"
                    autoResize={true}
                    suggestions={mentionSuggestions}
                    placeholder="Start typing to expand the textarea"
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Invalid & Disabled</CardTitle>
                  <CardDescription>Error and disabled mention box</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <MentionBox 
                    label="Feedback"
                    invalid={true}
                    error="Please enter valid feedback"
                    suggestions={mentionSuggestions}
                    required={true}
                  />
                  
                  <MentionBox 
                    label="Locked Comment"
                    value="This discussion is now closed."
                    disabled={true}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="selectButton" className="space-y-6 pt-4">
            <h2 className="text-xl font-semibold">Select Button Component</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Select Button</CardTitle>
                  <CardDescription>Button-style option selection</CardDescription>
                </CardHeader>
                <CardContent>
                  <SelectButton 
                    label="Size"
                    options={selectButtonOptions}
                    value={selectedButton}
                    onChange={(value) => {
                      setSelectedButton(value as string);
                      toast(`Selected: ${value}`);
                    }}
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Multiple Selection</CardTitle>
                  <CardDescription>Select multiple button options</CardDescription>
                </CardHeader>
                <CardContent>
                  <SelectButton 
                    label="Features"
                    options={[
                      { label: 'WiFi', value: 'wifi' },
                      { label: 'Bluetooth', value: 'bluetooth' },
                      { label: 'GPS', value: 'gps' },
                      { label: 'NFC', value: 'nfc' }
                    ]}
                    multiple={true}
                    onChange={(value) => toast(`Selected: ${value}`)}
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Custom Template</CardTitle>
                  <CardDescription>Custom rendering for option buttons</CardDescription>
                </CardHeader>
                <CardContent>
                  <SelectButton 
                    label="Priority"
                    options={[
                      { label: 'Low', value: 'low' },
                      { label: 'Medium', value: 'medium' },
                      { label: 'High', value: 'high' }
                    ]}
                    template={(option) => (
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "w-3 h-3 rounded-full",
                          option.value === 'low' && "bg-green-500",
                          option.value === 'medium' && "bg-yellow-500",
                          option.value === 'high' && "bg-red-500"
                        )} />
                        {option.label}
                      </div>
                    )}
                    onChange={(value) => toast(`Priority: ${value}`)}
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Invalid & Disabled</CardTitle>
                  <CardDescription>Error and disabled select buttons</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <SelectButton 
                    label="Required Choice"
                    options={selectButtonOptions}
                    invalid={true}
                    error="Please select an option"
                    required={true}
                  />
                  
                  <SelectButton 
                    label="Unavailable Options"
                    options={selectButtonOptions}
                    value="md"
                    disabled={true}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="rating" className="space-y-6 pt-4">
            <h2 className="text-xl font-semibold">Rating Component</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Rating</CardTitle>
                  <CardDescription>Standard star rating component</CardDescription>
                </CardHeader>
                <CardContent>
                  <RatingField 
                    label="Product Rating"
                    value={rating}
                    onChange={(value) => {
                      setRating(value);
                      toast(`Rated ${value} stars`);
                    }}
                    description="Click to rate from 1 to 5 stars"
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Without Cancel</CardTitle>
                  <CardDescription>Rating that can't be cleared once set</CardDescription>
                </CardHeader>
                <CardContent>
                  <RatingField 
                    label="Feedback"
                    allowCancel={false}
                    onChange={(value) => toast(`You rated ${value} stars`)}
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Custom Template</CardTitle>
                  <CardDescription>Customized rating display</CardDescription>
                </CardHeader>
                <CardContent>
                  <RatingField 
                    label="Difficulty Level"
                    count={3}
                    template={(value, index) => (
                      <div className={cn(
                        "h-8 w-8 flex items-center justify-center rounded-full text-white font-medium",
                        index < value 
                          ? "bg-primary" 
                          : "bg-muted text-muted-foreground"
                      )}>
                        {index + 1}
                      </div>
                    )}
                    onChange={(value) => toast(`Difficulty: ${value}`)}
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Read-only & Disabled</CardTitle>
                  <CardDescription>Non-interactive rating displays</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <RatingField 
                    label="Average Rating"
                    value={4}
                    readOnly={true}
                    description="Based on 42 reviews"
                  />
                  
                  <RatingField 
                    label="Your Rating"
                    value={0}
                    disabled={true}
                    description="Login to submit a rating"
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="multiState" className="space-y-6 pt-4">
            <h2 className="text-xl font-semibold">Multi-State Checkbox Component</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Multi-State Checkbox</CardTitle>
                  <CardDescription>Cycle through multiple states</CardDescription>
                </CardHeader>
                <CardContent>
                  <MultiStateCheckbox 
                    label="Availability"
                    value={multiState}
                    onChange={(value) => {
                      setMultiState(value);
                      toast(`Set to: ${value}`);
                    }}
                    options={multiStateOptions}
                    description="Click to cycle through Yes, No, Maybe"
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Custom Render</CardTitle>
                  <CardDescription>Custom rendering of checkbox states</CardDescription>
                </CardHeader>
                <CardContent>
                  <MultiStateCheckbox 
                    label="Status"
                    options={[
                      { value: 'approved', label: 'Approved' },
                      { value: 'pending', label: 'Pending' },
                      { value: 'rejected', label: 'Rejected' }
                    ]}
                    renderOption={(option) => (
                      <div className={cn(
                        "w-full h-full flex items-center justify-center",
                        option.value === 'approved' && "text-green-500",
                        option.value === 'pending' && "text-amber-500",
                        option.value === 'rejected' && "text-red-500"
                      )}>
                        {option.value === 'approved' && 'A'}
                        {option.value === 'pending' && 'P'}
                        {option.value === 'rejected' && 'R'}
                      </div>
                    )}
                    onChange={(value) => toast(`Status: ${value}`)}
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Invalid State</CardTitle>
                  <CardDescription>Multi-state checkbox with error</CardDescription>
                </CardHeader>
                <CardContent>
                  <MultiStateCheckbox 
                    label="Response Required"
                    options={['Yes', 'No']}
                    invalid={true}
                    error="Please make a selection"
                    required={true}
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Disabled State</CardTitle>
                  <CardDescription>Non-interactive multi-state checkbox</CardDescription>
                </CardHeader>
                <CardContent>
                  <MultiStateCheckbox 
                    label="System Status"
                    value="Online"
                    options={['Online', 'Offline', 'Maintenance']}
                    disabled={true}
                    description="Status is managed by the system"
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </CMSLayout>
  );
};

export default FieldsDemo;
